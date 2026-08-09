import { networkBySlug } from '$/constants/Network.ts'
import {
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
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
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { envioHyperRpc } from '$/sources/Envio/HyperRpc/queries.ts'
import type { RpcBlockWire } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'

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

const tipBlockReferences = async (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	limit: number
) => {
	assertEthereumMainnet($network)
	const tip = await getBlockNumber()
	return Array.from({
		length: Math.min(
			Number(tip + 1n),
			Math.max(1, limit)
		),
	}, (_value, blockOffset) => ({
		[EntityMetaKey.Selector]: {
			$network,
			blockNumber: tip - BigInt(blockOffset),
		},
	} satisfies Entity<typeof schema, EntityType.EvmBlock>))
}

const networkTipResolvers = {
	Caip2: {
		resolve: async (
			network: EntitySelector<typeof schema, EntityType.Network>,
			context: Parameters<typeof resolverContextRowLimit>[0]
		) => tipBlockReferences(
			network,
			resolverContextRowLimit(context)
		),
	},
	Slug: {
		resolve: async (
			network: EntitySelector<typeof schema, EntityType.Network>,
			context: Parameters<typeof resolverContextRowLimit>[0]
		) => tipBlockReferences(
			network,
			resolverContextRowLimit(context)
		),
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
			const blockHeight = await getBlockNumber()
			return [{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: Date.now(),
					source: Source.EnvioHyperRpc_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: blockHeight,
				},
			}]
		},
	},
	Slug: {
		resolve: async (network: EntitySelector<typeof schema, EntityType.Network>) => {
			assertEthereumMainnet(network)
			const blockHeight = await getBlockNumber()
			return [{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: Date.now(),
					source: Source.EnvioHyperRpc_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: blockHeight,
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
							logs: (receipt?.logs ?? []).map((log) => ({
								[EntityMetaKey.Selector]: {
									$transaction: {
										$network,
										txHash,
									},
									indexInTransaction: safeNumberQuantity(log.logIndex, 'log index'),
								},
							} satisfies Entity<typeof schema, EntityType.EvmLog>)),
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
				$$blocks: (blocks) => blocks,
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

		defineResolver({
			entityType: EntityType.EvmNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({ $network, timestampMs, source }) => {
						assertEthereumMainnet($network)
						if (source !== Source.EnvioHyperRpc_JsonRpc)
							throw new Error(`EnvioHyperRpc_JsonRpc: unsupported network timestamp source ${source}`)
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('EnvioHyperRpc_JsonRpc: invalid network observation timestamp')

						return {
							[EntityMetaKey.Selector]: {
								$network,
								timestampMs,
								source,
							},
							blockHeight: await getBlockNumber(),
						}
					},
				},
			},
		})({
			blockHeight: (observation) => observation.blockHeight,
		}),
	],
} satisfies RegisteredSourceResolverModule
