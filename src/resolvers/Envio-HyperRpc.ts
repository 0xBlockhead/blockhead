import { networkBySlug } from '$/constants/Network.ts'
import {
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
	EvmTokenStandard,
} from '$/constants/Evm.ts'
import { hexLowerOfByteSize, with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type Entity,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { envioHyperRpc } from '$/sources/Envio/HyperRpc/queries.ts'
import type {
	RpcBlockWire,
	RpcLog,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'

const ercTransferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const erc1155TransferSingleTopic = '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62'

const {
	getBlockByHash,
	getBlockByNumber,
	getBlockNumber,
	getTransactionByHash,
	getTransactionReceipt,
} = envioHyperRpc

const quantity = (
	value: string,
	fieldName: string
) => {
	try {
		const parsed = BigInt(value)
		if (parsed < 0n)
			throw new Error()

		return parsed
	} catch {
		throw new Error(`EnvioHyperRpc_JsonRpc: malformed ${fieldName}`)
	}
}

const safeNumberQuantity = (
	value: string | null | undefined,
	fieldName: string
) => {
	if (value == null)
		return undefined

	const parsed = quantity(value, fieldName)
	const number = Number(parsed)
	if (!Number.isSafeInteger(number))
		throw new Error(`EnvioHyperRpc_JsonRpc: ${fieldName} exceeds safe integer range`)

	return number
}

const requiredSafeNumberQuantity = (
	value: string | null | undefined,
	fieldName: string
) => {
	const number = safeNumberQuantity(value, fieldName)
	if (number == null)
		throw new Error(`EnvioHyperRpc_JsonRpc: missing ${fieldName}`)

	return number
}

const assertEthereumMainnet = (network: EntitySelector<typeof schema, EntityType.Network>) => {
	if (
		(
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.ethereum.caip2.namespace
			&& network.caip2.reference === networkBySlug.ethereum.caip2.reference
		)
		|| (
			'slug' in network
			&& network.slug === networkBySlug.ethereum.slug
		)
	)
		return

	throw new Error('EnvioHyperRpc_JsonRpc: unsupported network')
}

const schemaShapedEvmBlock = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	wire: RpcBlockWire
) => {
	const hash = hexLowerOfByteSize(wire.hash, 32)
	const parentHash = hexLowerOfByteSize(wire.parentHash, 32)
	const miner = hexLowerOfByteSize(wire.miner, 20)
	if (hash == null || parentHash == null)
		throw new Error('EnvioHyperRpc_JsonRpc: malformed block hash')
	if (miner == null)
		throw new Error('EnvioHyperRpc_JsonRpc: malformed miner address')

	const blockNumber = quantity(wire.number, 'block number')
	const timestampSeconds = Number(wire.timestamp)
	if (!Number.isFinite(timestampSeconds))
		throw new Error('EnvioHyperRpc_JsonRpc: malformed block timestamp')

	return {
		hash,
		parentHash,
		timestamp: timestampSeconds * 1_000,
		gasUsed: quantity(wire.gasUsed, 'gas used'),
		gasLimit: quantity(wire.gasLimit, 'gas limit'),
		baseFeePerGas: wire.baseFeePerGas == null ? undefined : quantity(wire.baseFeePerGas, 'base fee per gas'),
		blobGasUsed: wire.blobGasUsed == null ? undefined : quantity(wire.blobGasUsed, 'blob gas used'),
		excessBlobGas: wire.excessBlobGas == null ? undefined : quantity(wire.excessBlobGas, 'excess blob gas'),
		transactionCount: wire.transactions.length,
		$miner: {
			[EntityMetaKey.Selector]: {
				address: miner,
			},
		} satisfies Entity<typeof schema, EntityType.EvmAccount>,
		...(blockNumber > 0n && {
			$parent: {
				[EntityMetaKey.Selector]: {
					$network,
					blockNumber: blockNumber - 1n,
				},
			} satisfies Entity<typeof schema, EntityType.EvmBlock>,
		}),
		transactions: wire.transactions.map((transaction) => {
			const txHash = hexLowerOfByteSize(
				typeof transaction === 'string' ? transaction : transaction.hash,
				32
			)
			if (txHash == null)
				throw new Error('EnvioHyperRpc_JsonRpc: malformed transaction hash')

			return {
				[EntityMetaKey.Selector]: {
					$network,
					txHash,
				},
			} satisfies Entity<typeof schema, EntityType.EvmTransaction>
		}),
	}
}

const evmBlockProjections = {
	hash: (block: ReturnType<typeof schemaShapedEvmBlock>) => block.hash,
	parentHash: (block: ReturnType<typeof schemaShapedEvmBlock>) => block.parentHash,
	timestamp: (block: ReturnType<typeof schemaShapedEvmBlock>) => block.timestamp,
	gasUsed: (block: ReturnType<typeof schemaShapedEvmBlock>) => block.gasUsed,
	gasLimit: (block: ReturnType<typeof schemaShapedEvmBlock>) => block.gasLimit,
	baseFeePerGas: (block: ReturnType<typeof schemaShapedEvmBlock>) => block.baseFeePerGas,
	blobGasUsed: (block: ReturnType<typeof schemaShapedEvmBlock>) => block.blobGasUsed,
	excessBlobGas: (block: ReturnType<typeof schemaShapedEvmBlock>) => block.excessBlobGas,
	transactionCount: (block: ReturnType<typeof schemaShapedEvmBlock>) => block.transactionCount,
	$miner: (block: ReturnType<typeof schemaShapedEvmBlock>) => block.$miner,
	$parent: (block: ReturnType<typeof schemaShapedEvmBlock>) => block.$parent,
	$$transactions: (block: ReturnType<typeof schemaShapedEvmBlock>) => block.transactions,
}

const schemaShapedEvmLog = (
	$transaction: EntitySelector<typeof schema, EntityType.EvmTransaction>,
	indexInTransaction: number,
	log: RpcLog
) => {
	const transactionHash = hexLowerOfByteSize(log.transactionHash, 32)
	const emitterAddress = hexLowerOfByteSize(log.address, 20)
	const topics = (log.topics ?? []).map((topic) => {
		const normalizedTopic = hexLowerOfByteSize(topic, 32)
		if (normalizedTopic == null)
			throw new Error('EnvioHyperRpc_JsonRpc: malformed log topic')

		return normalizedTopic
	})
	const data = log.data == null ? undefined : log.data.toLowerCase()
	if (transactionHash !== $transaction.txHash)
		throw new Error('EnvioHyperRpc_JsonRpc: receipt log does not match the requested transaction')
	if (safeNumberQuantity(log.logIndex, 'log index') !== indexInTransaction)
		throw new Error('EnvioHyperRpc_JsonRpc: receipt log does not match the requested index')
	if (emitterAddress == null)
		throw new Error('EnvioHyperRpc_JsonRpc: malformed log emitter address')
	if (data != null && !/^0x(?:[0-9a-f]{2})*$/.test(data))
		throw new Error('EnvioHyperRpc_JsonRpc: malformed log data')

	const $log = {
		$transaction,
		indexInTransaction,
	}
	const tokenTransfer = (() => {
		const addressFromTopic = (topic: string | undefined) => {
			if (topic == null)
				return undefined
			if (topic.slice(2, 26) !== '0'.repeat(24))
				throw new Error('EnvioHyperRpc_JsonRpc: malformed address topic')

			return hexLowerOfByteSize(`0x${topic.slice(-40)}`, 20)
		}
		const dataWords = data?.match(/^0x([0-9a-f]{64})([0-9a-f]{64})?$/)
		if (topics[0] === ercTransferTopic && topics.length === 3 && dataWords?.[1] != null)
			return {
				standard: EvmTokenStandard.Erc20,
				amount: BigInt(`0x${dataWords[1]}`),
				tokenId: undefined,
				fromAddress: addressFromTopic(topics[1]),
				toAddress: addressFromTopic(topics[2]),
			}
		if (topics[0] === ercTransferTopic && topics.length === 4 && data === '0x')
			return {
				standard: EvmTokenStandard.Erc721,
				amount: 1n,
				tokenId: BigInt(topics[3]),
				fromAddress: addressFromTopic(topics[1]),
				toAddress: addressFromTopic(topics[2]),
			}
		if (topics[0] === erc1155TransferSingleTopic && topics.length === 4 && dataWords?.[2] != null)
			return {
				standard: EvmTokenStandard.Erc1155,
				amount: BigInt(`0x${dataWords[2]}`),
				tokenId: BigInt(`0x${dataWords[1]}`),
				fromAddress: addressFromTopic(topics[2]),
				toAddress: addressFromTopic(topics[3]),
			}

		return undefined
	})()

	return {
		[EntityMetaKey.Selector]: {
			...$log,
		},
		$transaction: {
			[EntityMetaKey.Selector]: $transaction,
		} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
		indexInTransaction,
		...(log.blockNumber != null && {
			$block: {
				[EntityMetaKey.Selector]: {
					$network: $transaction.$network,
					blockNumber: quantity(log.blockNumber, 'log block number'),
				},
			} satisfies Entity<typeof schema, EntityType.EvmBlock>,
		}),
		$$topics: topics.map((topic) => ({
			[EntityMetaKey.Selector]: {
				hex: topic,
			},
		} satisfies Entity<typeof schema, EntityType.EvmTopic>)),
		topic0: topics.at(0),
		...(data != null && {
			data: with0xHex(data),
		}),
		removed: log.removed,
		$emitter: {
			[EntityMetaKey.Selector]: {
				$network: $transaction.$network,
				address: emitterAddress,
			},
		} satisfies Entity<typeof schema, EntityType.EvmContract>,
		...(tokenTransfer != null && {
			$$tokenTransfers: [{
				[EntityMetaKey.Selector]: {
					$log,
					indexInLog: 0,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'standard')]: tokenTransfer.standard,
					[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'amount')]: tokenTransfer.amount,
					...(tokenTransfer.tokenId != null && {
						[entityFieldAddressKey(EntityType.EvmTokenTransfer, ['Nft'], 'tokenId')]: tokenTransfer.tokenId,
					}),
					...(tokenTransfer.fromAddress != null && {
						[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$from')]: {
							[EntityMetaKey.Selector]: { address: tokenTransfer.fromAddress },
						},
					}),
					...(tokenTransfer.toAddress != null && {
						[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$to')]: {
							[EntityMetaKey.Selector]: { address: tokenTransfer.toAddress },
						},
					}),
					[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$tokenContract')]: {
						[EntityMetaKey.Selector]: {
							$network: $transaction.$network,
							address: emitterAddress,
						},
					},
					...(tokenTransfer.standard === EvmTokenStandard.Erc20 && {
						[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$coinInstance')]: {
							[EntityMetaKey.Selector]: {
								$network: $transaction.$network,
								type: CoinInstanceType.Erc20Token,
								$contract: {
									$network: $transaction.$network,
									address: emitterAddress,
								},
							},
						},
					}),
				},
			}],
		}),
	}
}

const tipBlockReferences = async (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	context: Parameters<typeof resolverContextRowLimit>[0]
) => {
	assertEthereumMainnet($network)
	const tip = await getBlockNumber()
	if (
		context.providerContinuationToken != null
		&& !/^(0|[1-9][0-9]*)$/.test(context.providerContinuationToken)
	)
		throw new Error(`${Source.EnvioHyperRpc_JsonRpc}: invalid blocks continuation`)

	const firstBlockNumber = context.providerContinuationToken == null ?
		tip - BigInt(context.pagination.offset ?? 0)
	:
		BigInt(context.providerContinuationToken)
	if (firstBlockNumber > tip)
		throw new Error(`${Source.EnvioHyperRpc_JsonRpc}: blocks continuation exceeds head`)

	return {
		blocks: Array.from({
			length: Math.min(
				Math.max(
					Number(firstBlockNumber + 1n),
					0
				),
				Math.max(1, resolverContextRowLimit(context))
			),
		}, (_value, blockOffset) => ({
			[EntityMetaKey.Selector]: {
				$network,
				blockNumber: firstBlockNumber - BigInt(blockOffset),
			},
		} satisfies Entity<typeof schema, EntityType.EvmBlock>)),
	}
}

const hyperRpcTipBlockObservationClock = async () => {
	const blockHeight = await getBlockNumber()
	const wire = await getBlockByNumber({
		blockNumber: blockHeight,
		txObjects: false,
	})
	if (wire == null)
		throw new Error('EnvioHyperRpc_JsonRpc: tip block missing for network observation clock')

	const timestampSeconds = Number(wire.timestamp)
	if (!Number.isFinite(timestampSeconds) || timestampSeconds < 0)
		throw new Error('EnvioHyperRpc_JsonRpc: tip block timestamp missing for network observation clock')

	return {
		blockHeight,
		timestampMs: timestampSeconds * 1_000,
	}
}

const networkTipResolvers = {
	Caip2: {
		resolve: async (
			network: EntitySelector<typeof schema, EntityType.Network>,
			context: Parameters<typeof resolverContextRowLimit>[0]
		) => tipBlockReferences(network, context),
	},
	Slug: {
		resolve: async (
			network: EntitySelector<typeof schema, EntityType.Network>,
			context: Parameters<typeof resolverContextRowLimit>[0]
		) => tipBlockReferences(network, context),
	},
} as const

const networkTipCountResolvers = {
	Caip2: {
		resolve: async (network: EntitySelector<typeof schema, EntityType.Network>) => {
			assertEthereumMainnet(network)
			return Number(await getBlockNumber()) + 1
		},
	},
	Slug: {
		resolve: async (network: EntitySelector<typeof schema, EntityType.Network>) => {
			assertEthereumMainnet(network)
			return Number(await getBlockNumber()) + 1
		},
	},
} as const

const networkTimestampListResolvers = {
	Caip2: {
		resolve: async (network: EntitySelector<typeof schema, EntityType.Network>) => {
			assertEthereumMainnet(network)
			const tipClock = await hyperRpcTipBlockObservationClock()
			return [{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: tipClock.timestampMs,
					source: Source.EnvioHyperRpc_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: tipClock.blockHeight,
				},
			}]
		},
	},
	Slug: {
		resolve: async (network: EntitySelector<typeof schema, EntityType.Network>) => {
			assertEthereumMainnet(network)
			const tipClock = await hyperRpcTipBlockObservationClock()
			return [{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: tipClock.timestampMs,
					source: Source.EnvioHyperRpc_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: tipClock.blockHeight,
				},
			}]
		},
	},
} as const

export default {
	source: Source.EnvioHyperRpc_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }) => {
						assertEthereumMainnet($network)
						const [transaction, receipt] = await Promise.all([
							getTransactionByHash({ txHash }),
							getTransactionReceipt({ txHash }),
						])
						if (transaction == null)
							throw new Error(`EnvioHyperRpc_JsonRpc: transaction ${txHash} not found`)

						const fromAddress = hexLowerOfByteSize(transaction.from, 20)
						const toAddress = transaction.to == null ? undefined : hexLowerOfByteSize(transaction.to, 20)
						if (fromAddress == null)
							throw new Error('EnvioHyperRpc_JsonRpc: malformed from address')
						if (transaction.to != null && toAddress == null)
							throw new Error('EnvioHyperRpc_JsonRpc: malformed to address')

						const value = quantity(transaction.value, 'value')

						const envelopeType = (
							transaction.type == null || transaction.type === '0x0' ?
								EvmTransactionEnvelopeType.Legacy
							: transaction.type === '0x1' ?
								EvmTransactionEnvelopeType.AccessList
							: transaction.type === '0x2' ?
								EvmTransactionEnvelopeType.FeeMarket
							: transaction.type === '0x3' ?
								EvmTransactionEnvelopeType.Blob
							: transaction.type === '0x4' ?
								EvmTransactionEnvelopeType.SetCode
							:
								EvmTransactionEnvelopeType.Unknown
						)
						const contractAddress = receipt?.contractAddress == null ? undefined : hexLowerOfByteSize(receipt.contractAddress, 20)
						if (receipt?.contractAddress != null && contractAddress == null)
							throw new Error('EnvioHyperRpc_JsonRpc: malformed created contract address')

						return {
							...(transaction.blockNumber != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network,
										blockNumber: quantity(transaction.blockNumber, 'block number'),
									},
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
							$from: {
								[EntityMetaKey.Selector]: {
									address: fromAddress,
								},
							} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							...(toAddress != null && {
								$to: {
									[EntityMetaKey.Selector]: {
										address: toAddress,
									},
								} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							}),
							value,
							nonce: safeNumberQuantity(transaction.nonce, 'nonce'),
							indexInBlock: safeNumberQuantity(transaction.transactionIndex, 'transaction index'),
							gas: quantity(transaction.gas, 'gas'),
							gasPrice: transaction.gasPrice == null ? undefined : quantity(transaction.gasPrice, 'gas price'),
							gasUsed: receipt == null ? undefined : quantity(receipt.gasUsed, 'gas used'),
							cumulativeGasUsed: receipt == null ? undefined : quantity(receipt.cumulativeGasUsed, 'cumulative gas used'),
							effectiveGasPrice: receipt == null ? undefined : quantity(receipt.effectiveGasPrice, 'effective gas price'),
							input: with0xHex(transaction.input),
							r: with0xHex(transaction.r),
							s: with0xHex(transaction.s),
							v: transaction.v,
							executionStatus: (
								receipt == null ?
									EvmTransactionExecutionStatus.Pending
								: receipt.status === '0x1' ?
									EvmTransactionExecutionStatus.Success
								: receipt.status === '0x0' ?
									EvmTransactionExecutionStatus.Failed
								:
									(() => {
										throw new Error('EnvioHyperRpc_JsonRpc: malformed receipt status')
									})()
							),
							envelopeType,
							kind: (
								contractAddress != null || transaction.to == null ?
									EvmTransactionKind.ContractCreation
								: transaction.input !== '0x' && value > 0n ?
									EvmTransactionKind.NativeTransferAndCall
								: transaction.input !== '0x' ?
									EvmTransactionKind.ContractCall
								: value > 0n ?
									EvmTransactionKind.NativeTransfer
								:
									EvmTransactionKind.ContractCall
							),
							maxFeePerGas: transaction.maxFeePerGas == null ? undefined : quantity(transaction.maxFeePerGas, 'max fee per gas'),
							maxPriorityFeePerGas: transaction.maxPriorityFeePerGas == null ? undefined : quantity(transaction.maxPriorityFeePerGas, 'max priority fee per gas'),
							maxFeePerBlobGas: transaction.maxFeePerBlobGas == null ? undefined : quantity(transaction.maxFeePerBlobGas, 'max fee per blob gas'),
							blobGasUsed: receipt?.blobGasUsed == null ? undefined : quantity(receipt.blobGasUsed, 'blob gas used'),
							logs: (receipt?.logs ?? []).map((log) => schemaShapedEvmLog(
								{
									$network,
									txHash,
								},
					requiredSafeNumberQuantity(log.logIndex, 'log index'),
								log
							)),
						}
					},
				},
			},
		})({
			$block: (transaction) => transaction.$block,
			$from: (transaction) => transaction.$from,
			$to: (transaction) => transaction.$to,
			value: (transaction) => transaction.value,
			nonce: (transaction) => transaction.nonce,
			indexInBlock: (transaction) => transaction.indexInBlock,
			gas: (transaction) => transaction.gas,
			gasPrice: (transaction) => transaction.gasPrice,
			gasUsed: (transaction) => transaction.gasUsed,
			cumulativeGasUsed: (transaction) => transaction.cumulativeGasUsed,
			effectiveGasPrice: (transaction) => transaction.effectiveGasPrice,
			input: (transaction) => transaction.input,
			r: (transaction) => transaction.r,
			s: (transaction) => transaction.s,
			v: (transaction) => transaction.v,
			executionStatus: (transaction) => transaction.executionStatus,
			envelopeType: (transaction) => transaction.envelopeType,
			kind: (transaction) => transaction.kind,
			FeeMarket: {
				maxFeePerGas: (transaction) => transaction.maxFeePerGas,
				maxPriorityFeePerGas: (transaction) => transaction.maxPriorityFeePerGas,
			},
			Blob: {
				maxFeePerBlobGas: (transaction) => transaction.maxFeePerBlobGas,
				blobGasUsed: (transaction) => transaction.blobGasUsed,
			},
			$$logs: (transaction) => transaction.logs,
		}),

		defineResolver({
			entityType: EntityType.EvmLog,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }) => {
						assertEthereumMainnet($transaction.$network)
						const receipt = await getTransactionReceipt({
							txHash: $transaction.txHash,
						})
						if (receipt == null)
							throw new Error(`EnvioHyperRpc_JsonRpc: receipt for ${$transaction.txHash} not found`)

						const log = receipt.logs.find((candidate) => (
							safeNumberQuantity(candidate.logIndex, 'log index') === indexInTransaction
						))
						if (log == null)
							throw new Error(`EnvioHyperRpc_JsonRpc: receipt log ${String(indexInTransaction)} not found`)

						return schemaShapedEvmLog($transaction, indexInTransaction, log)
					},
				},
			},
		})({
			$transaction: (log) => log.$transaction,
			indexInTransaction: (log) => log.indexInTransaction,
			$$topics: (log) => log.$$topics,
			topic0: (log) => log.topic0,
			data: (log) => log.data,
			removed: (log) => log.removed,
			$block: (log) => log.$block,
			$emitter: (log) => log.$emitter,
			Event: {
				signatureHash: (log) => {
					if (log.topic0 == null)
						throw new Error('EnvioHyperRpc_JsonRpc: event log missing signature topic')

					return log.topic0
				},
				TokenTransfer: {
					$$tokenTransfers: (log) => log.$$tokenTransfers ?? [],
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EvmTokenTransfer,
			resolve: {
				LogIndexInLog: {
					resolve: async ({ $log, indexInLog }) => {
						if (indexInLog !== 0)
							throw new Error(`EnvioHyperRpc_JsonRpc: token transfer ${String(indexInLog)} not found`)

						assertEthereumMainnet($log.$transaction.$network)
						const receipt = await getTransactionReceipt({
							txHash: $log.$transaction.txHash,
						})
						if (receipt == null)
							throw new Error(`EnvioHyperRpc_JsonRpc: receipt for ${$log.$transaction.txHash} not found`)

						const log = receipt.logs.find((candidate) => (
							safeNumberQuantity(candidate.logIndex, 'log index') === $log.indexInTransaction
						))
						if (log == null)
							throw new Error(`EnvioHyperRpc_JsonRpc: receipt log ${String($log.indexInTransaction)} not found`)

						const transfer = schemaShapedEvmLog(
							$log.$transaction,
							$log.indexInTransaction,
							log
						).$$tokenTransfers?.[0]
						if (transfer == null)
							throw new Error('EnvioHyperRpc_JsonRpc: receipt log is not a supported token transfer')

						return transfer
					},
				},
			},
		})({
			$log: (transfer) => ({
				[EntityMetaKey.Selector]: transfer[EntityMetaKey.Selector].$log,
			}),
			indexInLog: (transfer) => transfer[EntityMetaKey.Selector].indexInLog,
			standard: (transfer) => transfer[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'standard')],
			amount: (transfer) => transfer[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'amount')],
			$from: (transfer) => transfer[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$from')],
			$to: (transfer) => transfer[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$to')],
			$tokenContract: (transfer) => transfer[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$tokenContract')],
			$coinInstance: (transfer) => transfer[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$coinInstance')],
			Nft: {
				tokenId: (transfer) => transfer[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTokenTransfer, ['Nft'], 'tokenId')],
			},
		}),

		defineResolver({
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }) => {
						assertEthereumMainnet($network)
						const wire = await getBlockByNumber({
							blockNumber,
							txObjects: false,
						})
						if (wire == null)
							throw new Error(`EnvioHyperRpc_JsonRpc: block ${blockNumber.toString()} not found`)

						return schemaShapedEvmBlock($network, wire)
					},
				},
				EvmNetworkBlockHash: {
					resolve: async ({ $network, hash }) => {
						assertEthereumMainnet($network)
						const wire = await getBlockByHash({
							blockHash: hash,
							txObjects: false,
						})
						if (wire == null)
							throw new Error(`EnvioHyperRpc_JsonRpc: block ${hash} not found`)

						return schemaShapedEvmBlock($network, wire)
					},
				},
			},
		})(evmBlockProjections),

		defineResolver({
			entityType: EntityType.Network,
			resolve: networkTipResolvers,
		})({
			Evm: {
				$$blocks: {
					select: (snapshot) => snapshot.blocks,
					continuation: (snapshot) => {
						const lastBlockNumber = snapshot.blocks.at(-1)?.[EntityMetaKey.Selector].blockNumber
						return {
							operation: 'network-blocks',
							terminal: lastBlockNumber == null || lastBlockNumber === 0n,
							...(lastBlockNumber != null && lastBlockNumber > 0n && {
								token: String(lastBlockNumber - 1n),
							}),
						}
					},
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: networkTipCountResolvers,
		})({
			Evm: {
				$$blocks: {
					resolveCount: (count) => count,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: networkTimestampListResolvers,
		})({
			Evm: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

	],
} satisfies RegisteredSourceResolverModule
