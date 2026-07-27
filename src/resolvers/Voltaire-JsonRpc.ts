import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { ChainId } from '$/constants/ChainId.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { Hex, toBytes } from '@tevm/voltaire/Hex'
import {
	EvmInternalCallType,
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { evmAbiFromJsonString } from '$/lib/evmAbi.ts'
import { hexLowerOfByteSize, with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { resolveMediaUrlTransport } from '$/lib/media.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import type { StreamBlock } from '@tevm/voltaire/block'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import {
	type Entity,
	type EntitySelector,
	type EntitySelectorForSelectorName,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/Source.ts'
import type { RpcLog } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'
import type {
	VoltaireBlockRpc,
	VoltaireCallTraceRpc,
	VoltaireTxRpc,
} from '$/sources/Voltaire/JsonRpc/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

type EvmNetworkId = EntitySelectorForSelectorName<typeof schema, EntityType.Network, 'Caip2'>
type NetworkCaip2Id = EntitySelectorForSelectorName<typeof schema, EntityType.Network, 'Caip2'>

const voltaireJsonRpcTransports = async () => (
	(await import('$/sources/Voltaire/JsonRpc/queries.ts')).voltaireJsonRpcTransports
)

const voltaireJsonRpcTransportByChainId = async () => (
	(await voltaireJsonRpcTransports()).transportByChainId
)

const voltaireJsonRpcTransportsByChainId = async () => (
	(await voltaireJsonRpcTransports()).transportsByChainId
)

const evmNetworkIdFromChainId = (chainId: number): EvmNetworkId => ({
	caip2: {
		namespace: 'eip155',
		reference: String(chainId),
	},
})

const evmInternalCallTypeFromVoltaireCallTrace = (raw: string | undefined) => (
	raw == null || raw === '' ?
		EvmInternalCallType.Unknown
	:
		((normalized) => (
			normalized === 'call' ? EvmInternalCallType.Call
			: normalized === 'callcode' ? EvmInternalCallType.CallCode
			: normalized === 'delegatecall' ? EvmInternalCallType.DelegateCall
			: normalized === 'staticcall' ? EvmInternalCallType.StaticCall
			: normalized === 'create' ? EvmInternalCallType.Create
			: normalized === 'create2' ? EvmInternalCallType.Create2
			: normalized === 'suicide' || normalized === 'selfdestruct' ? EvmInternalCallType.SelfDestruct
			: EvmInternalCallType.Unknown
		))(raw.toLowerCase())
)

const evmTraceEntitiesFromVoltaireCallTrace = ({
	call,
	$transaction,
	traceAddress = [],
}: {
	call: VoltaireCallTraceRpc
	$transaction: EntitySelector<typeof schema, EntityType.EvmTransaction>
	traceAddress?: number[]
}): Entity<typeof schema, EntityType.EvmTrace>[] => {
	const traceAddressString = traceAddress.length === 0 ? 'root' : traceAddress.join('.')
	const childTraces = (call.calls ?? []).flatMap((child, childIndex) => evmTraceEntitiesFromVoltaireCallTrace({
		call: child,
		$transaction,
		traceAddress: [...traceAddress, childIndex],
	}))
	const from = hexLowerOfByteSize(call.from ?? '', 20)
	const to = hexLowerOfByteSize(call.to ?? '', 20)

	return [
		{
			[EntityMetaKey.Selector]: {
				$transaction,
				traceAddress: traceAddressString,
			},
			$transaction: {
				[EntityMetaKey.Selector]: $transaction,
			},
			traceAddress: traceAddressString,
			index: traceAddress.at(-1) ?? 0,
			type: evmInternalCallTypeFromVoltaireCallTrace(call.type),
			...(from != null && {
				$from: {
					[EntityMetaKey.Selector]: { address: from },
				},
			}),
			...(to != null && {
				$to: {
					[EntityMetaKey.Selector]: { address: to },
				},
			}),
			...(call.value != null && { value: BigInt(call.value) }),
			...(call.gas != null && { gas: BigInt(call.gas) }),
			...(call.gasUsed != null && { gasUsed: BigInt(call.gasUsed) }),
			...(call.input != null && { input: with0xHex(call.input) }),
			...(call.output != null && { output: with0xHex(call.output) }),
			...(call.error != null && { error: call.error }),
			$$children: (call.calls ?? []).map((_child, childIndex) => ({
				[EntityMetaKey.Selector]: {
					$transaction,
					traceAddress: [...traceAddress, childIndex].join('.'),
				},
			})),
		},
		...childTraces,
	]
}

const chainIdFromEvmNetworkId = (network: EvmNetworkId | NetworkCaip2Id) => Number(network.caip2.reference)

const evmContractRuntimeCodeFromGetCodeHex = (
	codeHex: `0x${string}`
): `0x${string}` | undefined => (
	codeHex === '0x' || codeHex === '0x0' ?
		undefined
	:
		zeroExLowerCase(codeHex)
)

const evmContractBytecodeHashFromGetCodeHex = (
	codeHex: `0x${string}`
): `0x${string}` | undefined => {
	const runtimeCode = evmContractRuntimeCodeFromGetCodeHex(codeHex)
	return runtimeCode == null ?
		undefined
	:
		toHex(keccak256(toBytes(runtimeCode)))
}

const evmContractStorageSlotReadsFromEthGetStorageAt = async ({
	depth,
	getStorageAt,
}: {
	address: `0x${string}`
	depth: number
	getStorageAt: (slotQuantityHex: `0x${string}`) => Promise<`0x${string}`>
}) => {
	const storageSlots: {
		slot: `0x${string}`
		value: `0x${string}`
	}[] = []
	for (let slotIndex = 0; slotIndex < depth; slotIndex += 1) {
		const slotQuantityHex: `0x${string}` = `0x${BigInt(slotIndex).toString(16).padStart(64, '0')}`
		const valueHex = await getStorageAt(slotQuantityHex)
		const slotNormalized = hexLowerOfByteSize(slotQuantityHex, 32)
		const value = hexLowerOfByteSize(valueHex, 32)
		if (slotNormalized == null || value == null) continue
		storageSlots.push({
			slot: slotNormalized,
			value,
		})
	}
	return storageSlots
}

const evmLogIndexFromWire = (
	raw: string | undefined
): number | undefined => (
	raw == null ?
		undefined
	:
		((parsed) => (
		Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
			parsed
		:
			undefined
		))(
			raw.startsWith('0x') || raw.startsWith('0X') ?
				Number.parseInt(raw, 16)
			:
				Number(raw)
				)
)

const evmLogRpcQuantityToBigInt = (
	raw: string | undefined
): bigint | undefined => (
	raw == null ?
		undefined
	:
		((value) => (
		value < 0n ?
			undefined
		:
			value
		))(
			(() => {
				try {
					return BigInt(raw)
				} catch {
					return undefined
				}
			})() ?? -1n
		)
)

const evmLogEntitySelectorFromWire = ({
	$network,
	txHash,
	log,
}: {
	$network: EvmNetworkId
	txHash: string
	log: RpcLog
}) => {
	const logIndex = evmLogIndexFromWire(log.logIndex)
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	return logIndex == null || normalizedTxHash == null ?
		undefined
	:
		{
			$transaction: {
				$network,
				txHash: normalizedTxHash,
			},
			indexInTransaction: logIndex,
		}
}

const evmLogEntityFromIdAndWire = (
	entitySelector: Entity<typeof schema, EntityType.EvmLog>[typeof EntityMetaKey.Selector],
	log: RpcLog
): Entity<typeof schema, EntityType.EvmLog> => {
	const address = hexLowerOfByteSize(log.address ?? '', 20)
	const blockHash = hexLowerOfByteSize(log.blockHash ?? '', 32)
	const blockNumber = evmLogRpcQuantityToBigInt(log.blockNumber)
	const data = log.data == null ? undefined : with0xHex(log.data)
	const topics = (
		(log.topics ?? [])
			.flatMap((topic) => {
				const normalized = hexLowerOfByteSize(topic, 32)
				return normalized == null ? [] : [normalized]
			})
	)
	return {
		[EntityMetaKey.Selector]: entitySelector,
		$transaction: {
			[EntityMetaKey.Selector]: {
				$network: entitySelector.$transaction.$network,
				txHash: entitySelector.$transaction.txHash,
			},
		} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
		...(blockHash != null && blockNumber != null && {
			$block: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$transaction.$network,
					hash: blockHash,
				},
			} satisfies Entity<typeof schema, EntityType.EvmBlock>,
		}),
		$$topics: topics.map((hex) => ({
			[EntityMetaKey.Selector]: {
				hex,
			},
		} satisfies Entity<typeof schema, EntityType.EvmTopic>)),
		...(topics.at(0) != null && { topic0: topics.at(0) }),
		...(data != null && { data }),
		...(log.removed != null && { removed: log.removed }),
		...(address != null && {
			$emitter: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$transaction.$network,
					address,
				},
			} satisfies Entity<typeof schema, EntityType.EvmContract>,
		}),
	}
}

const findReceiptLogWireForEvmLogId = (
	logs: readonly RpcLog[] | undefined,
	logIndex: number
): RpcLog | undefined => (
	(logs ?? []).find((log) => (
		evmLogIndexFromWire(log.logIndex) === logIndex
	))
)

const evmTransactionEnvelopeTypeFromRpcTypeByte = (
	raw: number | undefined
): EvmTransactionEnvelopeType => (
	raw == null || !Number.isFinite(raw) || !Number.isInteger(raw) ?
		EvmTransactionEnvelopeType.Legacy
	:
		raw === 0 ?
			EvmTransactionEnvelopeType.Legacy
		:
			raw === 1 ?
				EvmTransactionEnvelopeType.AccessList
			:
				raw === 2 ?
				EvmTransactionEnvelopeType.FeeMarket
			:
				raw === 3 ?
				EvmTransactionEnvelopeType.Blob
			:
				raw === 4 ?
				EvmTransactionEnvelopeType.SetCode
			:
				EvmTransactionEnvelopeType.Unknown
)

const evmTransactionKindFromSignedFields = ({
	value,
	toAddress,
	input,
	createdContractAddress,
}: {
	value: bigint
	toAddress?: string
	input?: string
	createdContractAddress?: string
}): EvmTransactionKind => (
	createdContractAddress != null || toAddress == null ?
		EvmTransactionKind.ContractCreation
	:
		input != null && input !== '0x' && input.length > 2 ?
			value > 0n ?
				EvmTransactionKind.NativeTransferAndCall
			:
				EvmTransactionKind.ContractCall
		:
			value > 0n ?
				EvmTransactionKind.NativeTransfer
			:
				EvmTransactionKind.ContractCall
)

const evmBlobEntityRefsFromVoltaireTx = ({
	$network,
	txHash,
	blobVersionedHashes,
	blockNumber,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	blobVersionedHashes: readonly string[] | undefined
	blockNumber?: bigint
}) => (
	(blobVersionedHashes ?? []).flatMap((blobVersionedHash, blobIndex) => {
		const versionedHash = hexLowerOfByteSize(blobVersionedHash, 32)
		if (versionedHash == null || !versionedHash.startsWith('0x01')) return []
		return [{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network,
					txHash,
				},
				indexInTransaction: blobIndex,
			},
			$transaction: {
				[EntityMetaKey.Selector]: {
					$network,
					txHash,
				},
			} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
			...(blockNumber != null && {
				$block: {
					[EntityMetaKey.Selector]: {
						$network,
						blockNumber,
					},
				} satisfies Entity<typeof schema, EntityType.EvmBlock>,
			}),
			versionedHash: versionedHash as `0x01${string}`,
		}]
	})
)

const errorMessage = (error: unknown) => (
	error instanceof Error ?
		error.message
	:
		String(error)
)

const allJsonRpcEndpointsFailedError = (
	chainId: number,
	fieldName: string,
	errors: readonly string[]
) => (
	new Error(`Voltaire_JsonRpc: all JSON-RPC endpoints failed for Network.${fieldName} on chain ${String(chainId)}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
)

const evmTransactionRefsForTxHashes = (
	chainId: number,
	transactions: readonly (string | VoltaireTxRpc)[] | undefined
) => (
	(transactions ?? [])
		.map((transactionRef) => (
			typeof transactionRef === 'string' ?
				transactionRef
			:
				transactionRef.hash != null ?
					transactionRef.hash
				:
					undefined
		))
		.filter((hash): hash is string => hash != null && hash.length > 0)
		.map((hash) => hexLowerOfByteSize(hash, 32))
		.filter((hash): hash is `0x${string}` => hash != null)
		.map((txHash) => ({
			[EntityMetaKey.Selector]: {
				$network: evmNetworkIdFromChainId(chainId),
				txHash,
			},
		}))
)

const nonNegativeBigIntFromHex = (value: string | undefined) => (
	value == null ?
		undefined
	:
		((parsed) => (
			parsed == null || parsed < 0n ?
				undefined
			:
				parsed
		))((() => {
			try {
				return BigInt(value)
			} catch {
				return undefined
			}
		})())
)

const txpoolCountFromHex = (label: string, hex: string | undefined): number => {
	if (hex == null) throw new Error(`Voltaire_JsonRpc: txpool ${label} missing`)
	try {
		const n = Number(BigInt(hex))
		if (!Number.isFinite(n) || n < 0) throw new Error('txpool count out of range')
		return n
	} catch {
		throw new Error(`Voltaire_JsonRpc: txpool ${label} not a hex quantity`)
	}
}

const gasUsedRatioAtFromFeeHistory = (
	feeHistory: { gasUsedRatio: readonly (number | string)[] },
	index: number
) => {
	const raw = feeHistory.gasUsedRatio.at(index)
	if (raw == null) return undefined
	if (typeof raw === 'number') return raw
	if (typeof raw === 'string') {
		const parsed = Number.parseFloat(raw)
		return Number.isFinite(parsed) ? parsed : undefined
	}
	return undefined
}

const baseFeeAtFromFeeHistory = (
	feeHistory: { baseFeePerGas: readonly string[] },
	index: number
) => (
	nonNegativeBigIntFromHex(feeHistory.baseFeePerGas.at(index))
)

const baseFeePerBlobGasAtFromFeeHistory = (
	feeHistory: { baseFeePerBlobGas?: readonly string[] },
	index: number
) => (
	nonNegativeBigIntFromHex(feeHistory.baseFeePerBlobGas?.at(index))
)

const blobGasUsedRatioAtFromFeeHistory = (
	feeHistory: { blobGasUsedRatio?: readonly (number | string)[] },
	index: number
) => {
	const raw = feeHistory.blobGasUsedRatio?.at(index)
	if (raw == null) return undefined
	if (typeof raw === 'number') return raw
	if (typeof raw === 'string') {
		const parsed = Number.parseFloat(raw)
		return Number.isFinite(parsed) ? parsed : undefined
	}
	return undefined
}

const priorityRewardAt50thFromFeeHistoryAt = (
	feeHistory: { reward?: string[][] },
	index: number
) => (
	nonNegativeBigIntFromHex(feeHistory.reward?.at(index)?.at(0))
)

const networkGasFeeBlockRefsFromFeeHistory = (
	networkEntitySelector: EntitySelector<typeof schema, EntityType.Network>,
	feeHistory: {
		oldestBlock: string
		gasUsedRatio: readonly (number | string)[]
	}
) => {
	const oldestBlock = nonNegativeBigIntFromHex(feeHistory.oldestBlock)
	if (oldestBlock == null || feeHistory.gasUsedRatio.length === 0) return []
	return (
		Array.from(
			{ length: feeHistory.gasUsedRatio.length },
			(_entry, index) => ({
				[EntityMetaKey.Selector]: {
					$network: networkEntitySelector,
					blockNumber: oldestBlock + BigInt(index),
				},
			})
		)
	)
}

const evmBlobEntitiesFromVoltaireBlockWire = (
	chainId: number,
	blockNumber: bigint,
	wire: VoltaireBlockRpc
) => {
	const txs = wire.transactions ?? []
	const out = []
	for (const transactionRef of txs) {
		if (typeof transactionRef === 'string') continue
		const txHash = hexLowerOfByteSize(transactionRef.hash ?? '', 32)
		if (txHash == null) continue
		const bvh = transactionRef.blobVersionedHashes
		if (bvh == null) continue
		for (let blobIndex = 0; blobIndex < bvh.length; blobIndex += 1) {
			const h = bvh[blobIndex]
			if (typeof h !== 'string') continue
			const versionedHash = hexLowerOfByteSize(h, 32)
			if (versionedHash == null || !versionedHash.startsWith('0x01')) continue
			out.push({
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: evmNetworkIdFromChainId(chainId),
						txHash,
					},
					indexInTransaction: blobIndex,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmBlob, [], '$block')]: {
						[EntityMetaKey.Selector]: {
							$network: evmNetworkIdFromChainId(chainId),
							blockNumber,
						},
					} satisfies Entity<typeof schema, EntityType.EvmBlock>,
					[entityFieldAddressKey(EntityType.EvmBlob, [], '$transaction')]: {
						[EntityMetaKey.Selector]: {
							$network: evmNetworkIdFromChainId(chainId),
							txHash,
						},
					} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
					[entityFieldAddressKey(EntityType.EvmBlob, [], 'versionedHash')]: versionedHash as `0x01${string}`,
					},
			})
		}
	}
	return out
}

const networkScopedEvmBlockFieldsFromVoltaireBlockRpc = (
	chainId: number,
	wire: VoltaireBlockRpc
) => {
	const blockHash = hexLowerOfByteSize(wire.hash, 32)
	const parentHash = hexLowerOfByteSize(wire.parentHash, 32)
	const blockNumber = (() => {
		try {
			return BigInt(wire.number)
		} catch {
			return undefined
		}
	})()
	if (blockHash == null || blockNumber == null)
		return null
	return {
											[EntityMetaKey.Selector]: {
			$network: evmNetworkIdFromChainId(chainId),
			blockNumber,
		},
		blockNumber,
		hash: blockHash,
		...(parentHash != null && { parentHash }),
		timestamp: (
			typeof wire.timestamp === 'number' ?
				wire.timestamp * 1000
			:
				((parsed) => (
					Number.isFinite(parsed) ? parsed * 1000 : undefined
				))(Number(wire.timestamp))
		),
		gasUsed: nonNegativeBigIntFromHex(wire.gasUsed),
		gasLimit: nonNegativeBigIntFromHex(wire.gasLimit),
		baseFeePerGas: nonNegativeBigIntFromHex(wire.baseFeePerGas),
		blobGasUsed: nonNegativeBigIntFromHex(wire.blobGasUsed),
		excessBlobGas: nonNegativeBigIntFromHex(wire.excessBlobGas),
		transactionCount: (wire.transactions ?? []).length,
	}
}

export default {
	source: Source.Voltaire_JsonRpc,
	resolvers: [
		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber: blockNumberSelector }) => {
						const {
							getBlockByNumberForEndpoint,
						} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const chainId = chainIdFromEvmNetworkId($network)
						const jsonRpcTransport = (await voltaireJsonRpcTransportByChainId())[chainId]

						const voltaireBlockWire = await getBlockByNumberForEndpoint({
							...jsonRpcTransport,
							blockNumber: blockNumberSelector,
							fullTransactions: false,
						})
						if (voltaireBlockWire == null) throw new Error('Voltaire_JsonRpc: block not returned from RPC')

						const block = networkScopedEvmBlockFieldsFromVoltaireBlockRpc(
							chainId,
							voltaireBlockWire
						)
						if (block == null) throw new Error('Voltaire_JsonRpc: invalid block returned from RPC')

						const parentBlockNumber = block[EntityMetaKey.Selector].blockNumber > 0n ?
							block[EntityMetaKey.Selector].blockNumber - 1n
						:
							undefined
						const miner = hexLowerOfByteSize(voltaireBlockWire.miner, 20)

						const $$transactions = evmTransactionRefsForTxHashes(
							chainId,
							voltaireBlockWire.transactions
						)

						return {
							...block,
							$$transactions,
							...(parentBlockNumber != null && block.parentHash != null && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										blockNumber: parentBlockNumber,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.EvmBlock, [], 'hash')]: block.parentHash,
									},
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
							...(miner != null && {
								$miner: {
									[EntityMetaKey.Selector]: {
										address: miner,
									},
								} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							}),
						}
					},
				},
				EvmNetworkBlockHash: {
					resolve: async ({ $network, hash }) => {
						const {
							getBlockByHashForEndpoint,
						} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const chainId = chainIdFromEvmNetworkId($network)
						const jsonRpcTransport = (await voltaireJsonRpcTransportByChainId())[chainId]

						const voltaireBlockWire = await getBlockByHashForEndpoint({
							...jsonRpcTransport,
							blockHash: hash,
							fullTransactions: false,
						})
						if (voltaireBlockWire == null) throw new Error('Voltaire_JsonRpc: block not returned from RPC')

						const block = networkScopedEvmBlockFieldsFromVoltaireBlockRpc(
							chainId,
							voltaireBlockWire
						)
						if (block == null) throw new Error('Voltaire_JsonRpc: invalid block returned from RPC')

						const parentBlockNumber = block[EntityMetaKey.Selector].blockNumber > 0n ?
							block[EntityMetaKey.Selector].blockNumber - 1n
						:
							undefined
						const miner = hexLowerOfByteSize(voltaireBlockWire.miner, 20)

						return {
							...block,
							[EntityMetaKey.Selector]: {
								$network,
								hash: block.hash,
							},
							$$transactions: evmTransactionRefsForTxHashes(
								chainId,
								voltaireBlockWire.transactions
							),
							...(parentBlockNumber != null && block.parentHash != null && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network,
										hash: block.parentHash,
									},
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
							...(miner != null && {
								$miner: {
									[EntityMetaKey.Selector]: {
										address: miner,
									},
								} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							}),
						}
					},
				},
			},
		})({
				blockNumber: (entity) => entity.blockNumber,
				hash: (entity) => entity.hash,
				parentHash: (entity) => entity.parentHash,
				timestamp: (entity) => entity.timestamp,
				gasUsed: (entity) => entity.gasUsed,
				gasLimit: (entity) => entity.gasLimit,
				baseFeePerGas: (entity) => entity.baseFeePerGas,
				blobGasUsed: (entity) => entity.blobGasUsed,
				excessBlobGas: (entity) => entity.excessBlobGas,
				transactionCount: (entity) => entity.transactionCount,
				$parent: (entity) => entity.$parent,
				$miner: (entity) => entity.$miner,
				$$transactions: (entity) => entity.$$transactions,
			}),

				defineResolver(Source.Voltaire_JsonRpc, {
					entityType: EntityType.EvmBlob,
					resolve: {
						TransactionIndexInTransaction: {
							resolve: async (entitySelector) => {
								const {
									getTransactionByHashForEndpoint,
									getTransactionReceiptForEndpoint,
								} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
								const { getRpcReceipt } = await import('$/sources/Voltaire/JsonRpc/types.ts')
								const chainId = chainIdFromEvmNetworkId(entitySelector.$transaction.$network)
								const jsonRpcTransport = (await voltaireJsonRpcTransportByChainId())[chainId]
								const tx = await getTransactionByHashForEndpoint({
									...jsonRpcTransport,
									txHash: entitySelector.$transaction.txHash,
								})
								if (tx == null) throw new Error('Voltaire_JsonRpc: blob transaction not found')
								const bvh = tx.blobVersionedHashes
								if (!Array.isArray(bvh) || typeof bvh[entitySelector.indexInTransaction] !== 'string')
									throw new Error('Voltaire_JsonRpc: blob index missing on transaction')
								const versionedHash = hexLowerOfByteSize(bvh[entitySelector.indexInTransaction], 32)
								if (versionedHash == null || !versionedHash.startsWith('0x01')) throw new Error('Voltaire_JsonRpc: invalid blob versioned hash')
								const transactionBlockNumber = nonNegativeBigIntFromHex(tx.blockNumber)
								const receiptBlockNumber = await (async () => {
									if (transactionBlockNumber != null) return undefined
									const receiptWire = await getTransactionReceiptForEndpoint({
										...jsonRpcTransport,
										txHash: entitySelector.$transaction.txHash,
									})
									const receipt = receiptWire == null ? null : getRpcReceipt(receiptWire)
									return nonNegativeBigIntFromHex(receipt?.blockNumber)
								})()
								const blockNumber = transactionBlockNumber ?? receiptBlockNumber
								if (blockNumber == null) throw new Error('Voltaire_JsonRpc: blob transaction missing block')
								return {
									[EntityMetaKey.Selector]: entitySelector,
									versionedHash: versionedHash as `0x01${string}`,
									$transaction: {
										[EntityMetaKey.Selector]: {
											$network: evmNetworkIdFromChainId(chainId),
											txHash: entitySelector.$transaction.txHash,
										},
									} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
									$block: {
										[EntityMetaKey.Selector]: {
											$network: evmNetworkIdFromChainId(chainId),
											blockNumber,
										},
									} satisfies Entity<typeof schema, EntityType.EvmBlock>,
								}
							},
						}
					},
				})({
					indexInTransaction: (entity) => entity[EntityMetaKey.Selector].indexInTransaction,
					versionedHash: (entity) => entity.versionedHash,
					$transaction: (entity) => ({
						[EntityMetaKey.Selector]: entity.$transaction[EntityMetaKey.Selector],
					}),
					$block: (entity) => ({
						[EntityMetaKey.Selector]: entity.$block[EntityMetaKey.Selector],
					}),
				}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork_GasFee_Block,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async (entitySelector) => {
						const {
							getChainHeadNumberForEndpoint,
							getFeeHistoryForEndpoint,
							getGasPriceForEndpoint,
							getMaxPriorityFeePerGasForEndpoint,
						} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const chainId = chainIdFromEvmNetworkId(entitySelector.$network)
						const jsonRpcTransports = (await voltaireJsonRpcTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL for EvmNetwork_GasFee_Block')
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							if (jsonRpcTransport.transportType !== TransportType.Http) continue
							try {
								const feeHistory = await getFeeHistoryForEndpoint({
									...jsonRpcTransport,
									blockCount: 1,
									newestBlock: entitySelector.blockNumber,
									rewardPercentiles: [50],
								})
								const headBlockNumber = await getChainHeadNumberForEndpoint(jsonRpcTransport)
								const isHeadBlock = (
									headBlockNumber === entitySelector.blockNumber
								)
								let legacyGasPrice: bigint | undefined
								let maxPriorityFeePerGas: bigint | undefined
								if (isHeadBlock) {
									legacyGasPrice = nonNegativeBigIntFromHex(
										await getGasPriceForEndpoint(jsonRpcTransport)
									)
									try {
										maxPriorityFeePerGas = nonNegativeBigIntFromHex(
											await getMaxPriorityFeePerGasForEndpoint(jsonRpcTransport)
										)
									} catch {
									maxPriorityFeePerGas = undefined
									}
								}
								return {
									[EntityMetaKey.Selector]: entitySelector,
									baseFeePerGas: baseFeeAtFromFeeHistory(feeHistory, 0),
									legacyGasPrice,
									maxPriorityFeePerGas,
									gasUsedRatio: gasUsedRatioAtFromFeeHistory(feeHistory, 0),
									priorityFeeRewardAt50thPercentile: priorityRewardAt50thFromFeeHistoryAt(feeHistory, 0),
									baseFeePerBlobGas: baseFeePerBlobGasAtFromFeeHistory(feeHistory, 0),
									blobGasUsedRatio: blobGasUsedRatioAtFromFeeHistory(feeHistory, 0),
								}
							} catch (error) {
							errors.push(`${jsonRpcTransport.endpoint.locator} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmNetwork_GasFee_Block', errors)
					},
				}
			},
		})({
				baseFeePerGas: (gasFeeBlock) => gasFeeBlock.baseFeePerGas,
				legacyGasPrice: (gasFeeBlock) => gasFeeBlock.legacyGasPrice,
				maxPriorityFeePerGas: (gasFeeBlock) => gasFeeBlock.maxPriorityFeePerGas,
				gasUsedRatio: (gasFeeBlock) => gasFeeBlock.gasUsedRatio,
				priorityFeeRewardAt50thPercentile: (gasFeeBlock) => gasFeeBlock.priorityFeeRewardAt50thPercentile,
				baseFeePerBlobGas: (gasFeeBlock) => gasFeeBlock.baseFeePerBlobGas,
				blobGasUsedRatio: (gasFeeBlock) => gasFeeBlock.blobGasUsedRatio,
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork_Txpool_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async (entitySelector) => {
						const { getTxpoolStatusForEndpoint } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const chainId = chainIdFromEvmNetworkId(entitySelector.$network)
						const jsonRpcTransports = (await voltaireJsonRpcTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL for EvmNetwork_Txpool_Timestamp')
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							if (
								jsonRpcTransport.transportType !== TransportType.Http
								|| !jsonRpcTransport.supportsTxpool
							) continue
							try {
								const status = await getTxpoolStatusForEndpoint(jsonRpcTransport)
								return {
									[EntityMetaKey.Selector]: entitySelector,
									pendingCount: txpoolCountFromHex('pending', status.pending),
									queuedCount: txpoolCountFromHex('queued', status.queued),
								}
							} catch (error) {
							errors.push(`${jsonRpcTransport.endpoint.locator} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmNetwork_Txpool_Timestamp', errors)
					},
				}
			},
		})({
				pendingCount: (txpool) => txpool.pendingCount,
				queuedCount: (txpool) => txpool.queuedCount,
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EnsName,
			resolve: {
				NormalizedName: {
					resolve: async ({ name }) => {
						const {
							normalizeEnsName,
						} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
						const normalizedName = normalizeEnsName(name)
						return {
							name: normalizedName,
							normalizedName,
						}
					},
				}
			},
		})({
				name: (entity) => entity.name,
				normalizedName: (entity) => entity.normalizedName,
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmActorCoinAllowance,
			resolve: {
				EvmAccountEvmContractSpenderInteropAddress: {
					resolve: async ({ $actor, $contract, $spender, interopAddress }) => ({
						$actor,
						$contract,
						$actorCoin: {
							[EntityMetaKey.Selector]: {
								$actor,
								$contract,
							},
						},
						$spender,
						interopAddress,
					}),
				}
			},
		})({
				$actor: (allowance) => ({
					[EntityMetaKey.Selector]: allowance.$actor,
				}),
				$contract: (allowance) => ({
					[EntityMetaKey.Selector]: allowance.$contract,
				}),
				$actorCoin: (allowance) => allowance.$actorCoin,
				$spender: (allowance) => ({
					[EntityMetaKey.Selector]: allowance.$spender,
				}),
				interopAddress: (allowance) => allowance.interopAddress,
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash: txHashSelector }) => {
						const {
							debugTraceTransactionForEndpoint,
							getTransactionByHashForEndpoint,
							getTransactionReceiptForEndpoint,
						} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const {
							getRpcReceipt,
							getRpcTx,
						} = await import('$/sources/Voltaire/JsonRpc/types.ts')
						const chainId = chainIdFromEvmNetworkId($network)
						const jsonRpcTransport = (await voltaireJsonRpcTransportByChainId())[chainId]
						const voltaireTransactionWire = await getTransactionByHashForEndpoint({
							...jsonRpcTransport,
							txHash: txHashSelector,
						})
						if (voltaireTransactionWire == null) throw new Error('Voltaire_JsonRpc: transaction not returned from RPC')
						const jsonRpcTransaction = getRpcTx(voltaireTransactionWire, txHashSelector)
						const containingBlockNumber = (
							jsonRpcTransaction.blockNumber != null ? ((value) => (
							value == null || value < 0n ? undefined : value
							))((() => {
							try {
								return BigInt(jsonRpcTransaction.blockNumber)
							} catch {
								return undefined
							}
							})())
							:
								undefined
						)
						const txHash = (
							jsonRpcTransaction.hash != null ?
								(hexLowerOfByteSize(jsonRpcTransaction.hash, 32) ?? txHashSelector)
							:
								txHashSelector
						)
						const from = (
							jsonRpcTransaction.from != null ?
								hexLowerOfByteSize(jsonRpcTransaction.from, 20)
							:
								undefined
						)
						if (from == null)
							throw new Error('Voltaire_JsonRpc: transaction is missing from address')

						const to = (
							jsonRpcTransaction.to != null ?
								hexLowerOfByteSize(jsonRpcTransaction.to, 20)
							:
								undefined
						)
						const rpcTypeByte = (
							jsonRpcTransaction.type != null ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								undefined
							))(Number(jsonRpcTransaction.type))
							:
								undefined
						)
						const envelopeType = evmTransactionEnvelopeTypeFromRpcTypeByte(rpcTypeByte)
						const evmTransactionEntityBase = {
							[EntityMetaKey.Selector]: {
								$network: evmNetworkIdFromChainId(chainId),
								txHash,
							},
							...(containingBlockNumber != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network: evmNetworkIdFromChainId(chainId),
										blockNumber: containingBlockNumber,
									},
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
							$from: {
								[EntityMetaKey.Selector]: {
									address: from,
								},
							} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							...(to != null && {
								$to: {
									[EntityMetaKey.Selector]: {
										address: to,
									},
								} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							}),
							indexInBlock: (
								jsonRpcTransaction.transactionIndex != null ? ((parsed) => (
								Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
									parsed
								:
									undefined
								))(Number(jsonRpcTransaction.transactionIndex))
								:
									undefined
							),
							value: (
								jsonRpcTransaction.value != null ? ((value) => (
								value == null || value < 0n ? 0n : value
								))((() => {
								try {
									return BigInt(jsonRpcTransaction.value)
								} catch {
									return undefined
								}
								})())
								:
									0n
							),
							nonce: (
								jsonRpcTransaction.nonce != null ? ((parsed) => (
								Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
									parsed
								:
									undefined
								))(Number(jsonRpcTransaction.nonce))
								:
									undefined
							),
							...(jsonRpcTransaction.input != null && { input: with0xHex(jsonRpcTransaction.input) }),
							...(jsonRpcTransaction.r != null && { r: with0xHex(jsonRpcTransaction.r) }),
							...(jsonRpcTransaction.s != null && { s: with0xHex(jsonRpcTransaction.s) }),
							...(jsonRpcTransaction.v != null && { v: jsonRpcTransaction.v }),
							gas: (
								jsonRpcTransaction.gas != null ? ((value) => (
								value == null || value < 0n ? undefined : value
								))((() => {
								try {
									return BigInt(jsonRpcTransaction.gas)
								} catch {
									return undefined
								}
								})())
								:
									undefined
							),
							gasPrice: (
								jsonRpcTransaction.gasPrice != null ? ((value) => (
								value == null || value < 0n ? undefined : value
								))((() => {
								try {
									return BigInt(jsonRpcTransaction.gasPrice)
								} catch {
									return undefined
								}
								})())
								:
									undefined
							),
							...(
								(
								envelopeType === EvmTransactionEnvelopeType.FeeMarket
								|| envelopeType === EvmTransactionEnvelopeType.Blob
								|| envelopeType === EvmTransactionEnvelopeType.SetCode
								) && {
									maxFeePerGas: (
									jsonRpcTransaction.maxFeePerGas != null ? ((value) => (
										value == null || value < 0n ? undefined : value
									))((() => {
										try {
											return BigInt(jsonRpcTransaction.maxFeePerGas)
										} catch {
											return undefined
										}
									})())
									:
										undefined
									),
									maxPriorityFeePerGas: (
									jsonRpcTransaction.maxPriorityFeePerGas != null ? ((value) => (
										value == null || value < 0n ? undefined : value
									))((() => {
										try {
											return BigInt(jsonRpcTransaction.maxPriorityFeePerGas)
										} catch {
											return undefined
										}
									})())
									:
										undefined
									),
									maxFeePerBlobGas: (
									jsonRpcTransaction.maxFeePerBlobGas != null ? ((value) => (
										value == null || value < 0n ? undefined : value
									))((() => {
										try {
											return BigInt(jsonRpcTransaction.maxFeePerBlobGas)
										} catch {
											return undefined
										}
									})())
									:
										undefined
									),
								}
							),
						}
						const receiptWire = (
							await getTransactionReceiptForEndpoint({
								...jsonRpcTransport,
								txHash: txHash,
							})
						)
						const receipt = receiptWire == null ? null : getRpcReceipt(receiptWire)
						const createdContractAddress = (
							receipt?.contractAddress != null ?
								hexLowerOfByteSize(receipt.contractAddress, 20)
							:
								undefined
						)
						const rawCallTrace = await debugTraceTransactionForEndpoint({
							...jsonRpcTransport,
							txHash: txHash,
						})
						return {
							...evmTransactionEntityBase,
							envelopeType,
							kind: evmTransactionKindFromSignedFields({
								value: evmTransactionEntityBase.value,
								toAddress: to,
								input: jsonRpcTransaction.input,
								createdContractAddress,
							}),
							...(receipt == null && { executionStatus: EvmTransactionExecutionStatus.Pending }),
							...(Number(receipt?.status) === 1 && { executionStatus: EvmTransactionExecutionStatus.Success }),
							...(Number(receipt?.status) === 0 && { executionStatus: EvmTransactionExecutionStatus.Failed }),
							...(receipt?.gasUsed != null && ((value) => (
								value != null
							&& !(value < 0n)
							&& { gasUsed: value }
							))((() => {
							try {
								return BigInt(receipt.gasUsed)
							} catch {
								return undefined
							}
							})())),
							...(receipt?.cumulativeGasUsed != null && ((value) => (
								value != null
							&& !(value < 0n)
							&& { cumulativeGasUsed: value }
							))((() => {
							try {
								return BigInt(receipt.cumulativeGasUsed)
							} catch {
								return undefined
							}
							})())),
							...(receipt?.effectiveGasPrice != null && ((value) => (
								value != null
							&& !(value < 0n)
							&& { effectiveGasPrice: value }
							))((() => {
							try {
								return BigInt(receipt.effectiveGasPrice)
							} catch {
								return undefined
							}
							})())),
							...(receipt?.blobGasUsed != null && ((value) => (
								value != null
							&& !(value < 0n)
							&& { blobGasUsed: value }
							))((() => {
							try {
								return BigInt(receipt.blobGasUsed)
							} catch {
								return undefined
							}
							})())),
							...(receipt?.contractAddress != null && ((address) => (
								address != null && {
									$contract: {
										[EntityMetaKey.Selector]: {
											$network,
											address,
										},
									} satisfies Entity<typeof schema, EntityType.EvmContract>,
								}
							))(createdContractAddress)),
							$$logs: (
								(receipt?.logs ?? [])
									.flatMap((log) => {
										const id = evmLogEntitySelectorFromWire({
											$network,
											txHash,
											log,
										})
										return id == null ?
											[]
										:
											[evmLogEntityFromIdAndWire(id, log)]
									})
							),
							$$traces: rawCallTrace == null ? [] : evmTraceEntitiesFromVoltaireCallTrace({
								call: rawCallTrace,
								$transaction: {
									$network,
									txHash,
								},
							}),
						}
					},
				}
			},
		})({
				$block: (entity) => entity.$block,
				$from: (entity) => entity.$from,
				$to: (entity) => entity.$to,
				ContractCreation: {
					$contract: (entity) => entity.$contract,
				},
				indexInBlock: (entity) => entity.indexInBlock,
				value: (entity) => entity.value,
				nonce: (entity) => entity.nonce,
				input: (entity) => entity.input,
				r: (entity) => entity.r,
				s: (entity) => entity.s,
				v: (entity) => entity.v,
				gas: (entity) => entity.gas,
				kind: (entity) => entity.kind,
				envelopeType: (entity) => entity.envelopeType,
				executionStatus: (entity) => entity.executionStatus,
				gasPrice: (entity) => entity.gasPrice,
				gasUsed: (entity) => entity.gasUsed,
				cumulativeGasUsed: (entity) => entity.cumulativeGasUsed,
				effectiveGasPrice: (entity) => entity.effectiveGasPrice,
				FeeMarket: {
					maxFeePerGas: (entity) => entity.maxFeePerGas,
					maxPriorityFeePerGas: (entity) => entity.maxPriorityFeePerGas,
				},
				Blob: {
					blobGasUsed: (entity) => entity.blobGasUsed,
					maxFeePerBlobGas: (entity) => entity.maxFeePerBlobGas,
				},
				$$logs: {
					select: (entity) => entity.$$logs.map((log) => ({
						[EntityMetaKey.Selector]: log[EntityMetaKey.Selector],
					})),
					resolveCount: (entity) => entity.$$logs.length,
				},
				$$traces: {
					select: (entity) => entity.$$traces,
					resolveCount: (entity) => entity.$$traces.length,
				},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmLog,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async (entitySelector) => {
						const {
							getTransactionReceiptForEndpoint,
						} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const { getRpcReceipt } = await import('$/sources/Voltaire/JsonRpc/types.ts')
						const chainId = chainIdFromEvmNetworkId(entitySelector.$transaction.$network)
						const jsonRpcTransport = (await voltaireJsonRpcTransportByChainId())[chainId]
						const receiptWire = await getTransactionReceiptForEndpoint({
							...jsonRpcTransport,
							txHash: entitySelector.$transaction.txHash,
						})
						const receipt = receiptWire == null ? null : getRpcReceipt(receiptWire)
						const log = findReceiptLogWireForEvmLogId(receipt?.logs, entitySelector.indexInTransaction)
						if (log == null)
							throw new Error('Voltaire_JsonRpc: receipt log not found for EvmLog')
						return evmLogEntityFromIdAndWire(entitySelector, log)
					},
				}
			},
		})({
				$$topics: (entity) => entity.$$topics,
				topic0: (entity) => entity.topic0,
				indexInTransaction: (entity) => entity[EntityMetaKey.Selector].indexInTransaction,
				$transaction: (entity) => (
					entity.$transaction == null ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: entity.$transaction[EntityMetaKey.Selector],
						}
				),
				$block: (entity) => (
					entity.$block == null ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: entity.$block[EntityMetaKey.Selector],
						}
				),
				data: (entity) => entity.data,
				removed: (entity) => entity.removed,
				$emitter: (entity) => (
					entity.$emitter == null ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: entity.$emitter[EntityMetaKey.Selector],
					}
				),
				Event: {
					signatureHash: (entity) => entity.topic0,
				},
			}),
		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async () => ({}),
				},
			},
			resolveLive: {
				blockStream: {
					facetPath: [
						'Evm',
					],
					publishes: {
						'$$timestamps': true,
						'$$blocks': true,
						'$$transactions': true,
						'$$contracts': true,
						'$$blobs': true,
						'$$beaconEpochs': true,
						'$$beaconSlots': true,
					},
					start: (ctx) => {
						void (async () => {
							const {
								fields,
								parentEntitySelector,
								signal,
							} = ctx
							const activityFields = [
								'$$transactions',
								'$$contracts',
								'$$blobs',
							] as const
							const allLiveFieldNames = [
								'$$timestamps',
								'$$blocks',
								...activityFields,
								'$$beaconEpochs',
								'$$beaconSlots',
							] as const
							const recentBlockDepth = Math.max(1, resolverContextRowLimit(ctx.trigger))
							const backstop = setInterval(
								() => { void fields.invalidate(allLiveFieldNames) },
								30_000
							)
							const clear = () => {
								clearInterval(backstop)
							}
							signal.addEventListener('abort', clear, { once: true })

							const candidateTransports = (await voltaireJsonRpcTransportsByChainId())[chainIdFromEvmNetworkId(parentEntitySelector)] ?? []
							if (candidateTransports.length === 0) {
								clear()
								return
							}

							const {
								getChainHeadNumberForEndpoint,
								getProviderForExecutionUrl,
								iterateBlockStreamEvents,
							} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
							const waitBeforeRetry = (ms: number) => (
								new Promise<void>((resolve) => {
								const timeout = setTimeout(resolve, ms)
								signal.addEventListener(
									'abort',
									() => {
										clearTimeout(timeout)
										resolve()
									},
									{ once: true }
								)
								})
							)
							const writeRecentBlocksForTransport = async (
								jsonRpcTransport: (typeof candidateTransports)[number],
								recentBlockDepth = 16
						) => {
							const { getRecentBlockWiresForEndpoint } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
							const { wires } = await getRecentBlockWiresForEndpoint({
								...jsonRpcTransport,
								recentBlockDepth,
							})
							const evmBlocks = (
								wires.flatMap((wire) => {
									if (wire == null) return []

									const value = networkScopedEvmBlockFieldsFromVoltaireBlockRpc(
										chainIdFromEvmNetworkId(parentEntitySelector),
										wire
									)
									return (
										value == null ?
											[]
										:
											[{
												[EntityMetaKey.Selector]: value[EntityMetaKey.Selector],
												[EntityMetaKey.Fields]: Object.fromEntries(
													Object.entries(value)
														.filter(([fieldName]) => fieldName !== EntityMetaKey.Selector)
														.map(([fieldName, fieldValue]) => [
															entityFieldAddressKey(EntityType.EvmBlock, [], fieldName),
															fieldValue,
														])
												),
											}]
									)
								})
							)
							if (evmBlocks.length > 0)
								fields.$$blocks.replaceRows([{
									source: Source.Voltaire_JsonRpc,
									value: evmBlocks,
								}])
						}

							while (!signal.aborted) {
								for (const jsonRpcTransport of candidateTransports) {
									if (
										typeof window !== 'undefined'
										&& jsonRpcTransport.transportType === TransportType.WebSocket
									) continue

									const provider = await getProviderForExecutionUrl({
										endpoint: jsonRpcTransport.endpoint,
										transportType: jsonRpcTransport.transportType,
									})
									let initialized = false
									try {
										const currentHead = await getChainHeadNumberForEndpoint(jsonRpcTransport)
										fields.$$timestamps.replaceRows([{
											source: Source.Voltaire_JsonRpc,
											value: [{
												[EntityMetaKey.Selector]: {
													$network: parentEntitySelector,
														timestampMs: Date.now(),
												source: Source.Voltaire_JsonRpc,
											},
											[EntityMetaKey.Fields]: {
												[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: currentHead,
											},
												}],
											}])
										fields.$$blocks.count.replaceRows([{
											source: Source.Voltaire_JsonRpc,
											value: Number(currentHead) + 1,
										}])
										await writeRecentBlocksForTransport(jsonRpcTransport, recentBlockDepth)
										initialized = true
										for await (const event of iterateBlockStreamEvents({
											provider,
											include: 'transactions',
											signal,
											fromBlock: currentHead + 1n,
											maxQueuedBlocks: 16,
											pollingInterval: 1_000,
											retry: {
												initialDelay: 1_000,
												maxDelay: 10_000,
												maxRetries: 5,
											},
										})) {
										if (event.type === 'reorg') {
											await fields.invalidate(allLiveFieldNames)
											try {
												const chainHead = await getChainHeadNumberForEndpoint(jsonRpcTransport)
												fields.$$timestamps.replaceRows([{
													source: Source.Voltaire_JsonRpc,
													value: [{
														[EntityMetaKey.Selector]: {
															$network: parentEntitySelector,
																timestampMs: Date.now(),
													source: Source.Voltaire_JsonRpc,
												},
												[EntityMetaKey.Fields]: {
													[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: chainHead,
												},
														}],
													}])
												fields.$$blocks.count.replaceRows([{
													source: Source.Voltaire_JsonRpc,
													value: Number(chainHead) + 1,
												}])
												await writeRecentBlocksForTransport(jsonRpcTransport, recentBlockDepth)
											} catch {
												// invalidate scheduled refetch
											}
											continue
										}

										fields.$$timestamps.replaceRows([{
											source: Source.Voltaire_JsonRpc,
											value: [{
												[EntityMetaKey.Selector]: {
													$network: parentEntitySelector,
														timestampMs: Date.now(),
												source: Source.Voltaire_JsonRpc,
											},
											[EntityMetaKey.Fields]: {
												[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: event.metadata.chainHead,
											},
												}],
											}])
										fields.$$blocks.count.replaceRows([{
											source: Source.Voltaire_JsonRpc,
											value: Number(event.metadata.chainHead) + 1,
										}])
										await writeRecentBlocksForTransport(jsonRpcTransport, recentBlockDepth)

										if (event.blocks.length > 0)
											await fields.invalidate(activityFields)
										}
										await waitBeforeRetry(1_000)
										break
									} catch (error) {
									console.warn('Voltaire: block stream ended', {
										error,
										endpoint: jsonRpcTransport.endpoint.locator,
										transportType: jsonRpcTransport.transportType,
									})
									await waitBeforeRetry(1_000)
									if (initialized)
										break
									}
								}
							}
						})()
					},
				},
			},
		})({
				Evm: {
					'$$timestamps': {},
					'$$blocks': {},
					'$$transactions': {},
					'$$contracts': {},
					'$$blobs': {},
					'$$beaconEpochs': {},
					'$$beaconSlots': {},
				},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmAccount,
			resolve: {
				AddressInteropAddress: {
					resolve: async ({ address }) => {
						const {
							normalizeEnsName,
							resolveEnsReverseForEndpoint,
						} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
						const chainId = ChainId.Ethereum
						const jsonRpcTransport = (await voltaireJsonRpcTransportByChainId())[chainId]
						const ensNameFromReverseLookup = await resolveEnsReverseForEndpoint({
							...jsonRpcTransport,
							address: address,
						})
						if (ensNameFromReverseLookup == null) return undefined
						const normalizedPrimaryName = normalizeEnsName(ensNameFromReverseLookup)
						return {
							[EntityMetaKey.Selector]: {
								name: normalizedPrimaryName,
							},
						} satisfies Entity<typeof schema, EntityType.EnsName>
					},
				}
			},
			})({
					$primaryName: (entity) => entity,
				}),

			defineResolver(Source.Voltaire_JsonRpc, {
				entityType: EntityType.Network,
				resolve: {
					Caip2: {
						resolve: async (entitySelector) => {
							const { getChainHeadNumberForEndpoint } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
							const jsonRpcTransports = (await voltaireJsonRpcTransportsByChainId())[chainIdFromEvmNetworkId(entitySelector)] ?? []
							if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.$$timestamps on chain ${String(chainIdFromEvmNetworkId(entitySelector))}`)
							const errors: string[] = []
							for (const jsonRpcTransport of jsonRpcTransports) {
								try {
									return [{
										[EntityMetaKey.Selector]: {
											$network: entitySelector,
											timestampMs: Date.now(),
											source: Source.Voltaire_JsonRpc,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: await getChainHeadNumberForEndpoint(jsonRpcTransport),
										},
									}]
								} catch (error) {
									errors.push(`${jsonRpcTransport.endpoint.locator} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
								}
							}
							throw allJsonRpcEndpointsFailedError(chainIdFromEvmNetworkId(entitySelector), '$$timestamps', errors)
						},
					}
				},
			})({
					Evm: {
						$$timestamps: (entity) => entity,
					},
				}),

			defineResolver(Source.Voltaire_JsonRpc, {
				entityType: EntityType.EvmNetwork_Timestamp,
				resolve: {
					NetworkTimestampMsSource: {
						resolve: async (entitySelector) => {
						const { getChainHeadNumberForEndpoint } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const jsonRpcTransports = (await voltaireJsonRpcTransportsByChainId())[chainIdFromEvmNetworkId(entitySelector.$network)] ?? []
						if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmNetwork_Timestamp.blockHeight on chain ${String(chainIdFromEvmNetworkId(entitySelector.$network))}`)
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								return {
									[EntityMetaKey.Selector]: entitySelector,
									blockHeight: await getChainHeadNumberForEndpoint(jsonRpcTransport),
								}
							} catch (error) {
							errors.push(`${jsonRpcTransport.endpoint.locator} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
							continue
							}
						}
						throw allJsonRpcEndpointsFailedError(chainIdFromEvmNetworkId(entitySelector.$network), 'blockHeight', errors)
					},
					}
			},
		})({
				blockHeight: (entity) => entity.blockHeight,
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const { getFeeHistoryForEndpoint } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const blockCount = Math.min(
							32,
							Math.max(1, resolverContextRowLimit(context))
						)
						const jsonRpcTransports = (await voltaireJsonRpcTransportsByChainId())[chainIdFromEvmNetworkId(entitySelector)] ?? []
						if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.$$gasFeeBlocks on chain ${String(chainIdFromEvmNetworkId(entitySelector))}`)
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							if (jsonRpcTransport.transportType !== TransportType.Http) continue
							try {
								const feeHistory = await getFeeHistoryForEndpoint({
									...jsonRpcTransport,
									blockCount,
									newestBlock: 'latest',
									rewardPercentiles: [50],
								})
								return networkGasFeeBlockRefsFromFeeHistory(entitySelector, feeHistory)
							} catch (error) {
							errors.push(`${jsonRpcTransport.endpoint.locator} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainIdFromEvmNetworkId(entitySelector), '$$gasFeeBlocks', errors)
					},
				}
			},
		})({
				Evm: {
					$$gasFeeBlocks: (entity) => entity,
				},
			}),

			defineResolver(Source.Voltaire_JsonRpc, {
				entityType: EntityType.Network,
				resolve: {
					Caip2: {
						resolve: async (entitySelector) => {
							const { getTxpoolStatusForEndpoint } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
							const jsonRpcTransports = (await voltaireJsonRpcTransportsByChainId())[chainIdFromEvmNetworkId(entitySelector)] ?? []
							for (const jsonRpcTransport of jsonRpcTransports) {
								if (
									jsonRpcTransport.transportType !== TransportType.Http
									|| !jsonRpcTransport.supportsTxpool
								) continue
								try {
									const status = await getTxpoolStatusForEndpoint(jsonRpcTransport)
									return [
										{
											[EntityMetaKey.Selector]: {
												$network: entitySelector,
												timestampMs: Date.now(),
												source: Source.Voltaire_JsonRpc,
											},
											[EntityMetaKey.Fields]: {
												[entityFieldAddressKey(EntityType.EvmNetwork_Txpool_Timestamp, [], 'pendingCount')]: txpoolCountFromHex('pending', status.pending),
												[entityFieldAddressKey(EntityType.EvmNetwork_Txpool_Timestamp, [], 'queuedCount')]: txpoolCountFromHex('queued', status.queued),
											},
										},
									]
								} catch {
									continue
								}
							}
							return []
						},
					}
				},
			})({
				Evm: {
					$$txpoolTimestamps: (entity) => entity,
				},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const subsetRowLimit = resolverContextRowLimit(context)
						const {
							getRecentBlockWiresForEndpoint,
						} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const chainId = chainIdFromEvmNetworkId(entitySelector)
						const jsonRpcTransports = (await voltaireJsonRpcTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const { wires } = await getRecentBlockWiresForEndpoint({
									...jsonRpcTransport,
									recentBlockDepth: subsetRowLimit,
								})
								return (
									wires
										.flatMap((wire) => (
										wire == null ?
											[]
										:
											(() => {
												const value = networkScopedEvmBlockFieldsFromVoltaireBlockRpc(
													chainId,
													wire
											)
												return value == null ? [] : [{
													[EntityMetaKey.Selector]: value[EntityMetaKey.Selector],
													[EntityMetaKey.Fields]: Object.fromEntries(
														Object.entries(value)
															.filter(([fieldName]) => fieldName !== EntityMetaKey.Selector)
															.map(([fieldName, fieldValue]) => [
																entityFieldAddressKey(EntityType.EvmBlock, [], fieldName),
																fieldValue,
															])
													),
												}]
											})()
										))
								)
							} catch (error) {
								errors.push(`${jsonRpcTransport.endpoint.locator} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, '$$blocks', errors)
					},
				}
			},
		})({
				Evm: {
					$$blocks: (entity) => entity,
				},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector) => {
						const {
							getChainHeadNumberForEndpoint,
						} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const chainId = chainIdFromEvmNetworkId(entitySelector)
						const jsonRpcTransports = (await voltaireJsonRpcTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								return Number(await getChainHeadNumberForEndpoint(jsonRpcTransport)) + 1
							} catch (error) {
								errors.push(`${jsonRpcTransport.endpoint.locator} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, '$$blocks count', errors)
					},
				}
			},
		})({
				Evm: {
					$$blocks: {
						resolveCount: (count) => count,
					},
				},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const subsetRowLimit = resolverContextRowLimit(context)
							const {
								getBlockByNumberForEndpoint,
								getChainHeadNumberForEndpoint,
							} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
							const chainId = chainIdFromEvmNetworkId(entitySelector)
							const jsonRpcTransports = (await voltaireJsonRpcTransportsByChainId())[chainId] ?? []
							if (jsonRpcTransports.length === 0)
								throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.$$blobs on chain ${String(chainId)}`)

							const depth = Math.min(Math.max(1, subsetRowLimit), 2)
							const errors: string[] = []
							for (const jsonRpcTransport of jsonRpcTransports) {
								try {
									const head = await getChainHeadNumberForEndpoint(jsonRpcTransport)
									const evmBlobs = []
									for (
										const blockNumber of Array.from(
											{ length: depth },
											(_, index) => head - BigInt(index)
										).filter((number) => number >= 0n)
									) {
										const wire = await getBlockByNumberForEndpoint({
											...jsonRpcTransport,
											blockNumber,
											fullTransactions: true,
										})
										if (wire != null)
											evmBlobs.push(
												...evmBlobEntitiesFromVoltaireBlockWire(
													chainId,
													blockNumber,
													wire
												)
											)
									}
									return evmBlobs
								} catch (error) {
									errors.push(`${jsonRpcTransport.endpoint.locator} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
								}
							}
							throw allJsonRpcEndpointsFailedError(chainId, '$$blobs', errors)
						},
					}
			},
		})({
				Evm: {
					$$blobs: (entity) => entity,
				},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }) => {
						const { getTransactionByHashForEndpoint } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const chainId = chainIdFromEvmNetworkId($network)
						const jsonRpcTransport = (await voltaireJsonRpcTransportByChainId())[chainId]
						const tx = await getTransactionByHashForEndpoint({
							...jsonRpcTransport,
							txHash: txHash,
						})
						if (tx == null) throw new Error('Voltaire_JsonRpc: transaction not found for blobs')
						return evmBlobEntityRefsFromVoltaireTx({
							$network: $network,
							txHash: txHash,
							blobVersionedHashes: tx.blobVersionedHashes,
							blockNumber: nonNegativeBigIntFromHex(tx.blockNumber),
						})
					},
				}
			},
		})({
				Blob: {
					$$blobs: (entity) => entity,
				},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }) => {
						const {
							getTransactionReceiptForEndpoint,
						} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const { getRpcReceipt } = await import('$/sources/Voltaire/JsonRpc/types.ts')
						const jsonRpcTransport = (await voltaireJsonRpcTransportByChainId())[chainIdFromEvmNetworkId($network)]
						const receiptWire = await getTransactionReceiptForEndpoint({
							...jsonRpcTransport,
							txHash: txHash,
						})
						const receipt = receiptWire == null ? null : getRpcReceipt(receiptWire)
						const entities = (
							(receipt?.logs ?? [])
								.flatMap((log) => {
								const id = evmLogEntitySelectorFromWire({
									$network,
									txHash,
									log,
								})
								return id == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: id,
									}]
								})
						)
						return entities
					},
				}
			},
		})({
				$$logs: (entity) => entity,
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }) => {
						const {
							getBlockByNumberForEndpoint,
						} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const { getRpcHeader } = await import('$/sources/Voltaire/JsonRpc/types.ts')
						const jsonRpcTransport = (await voltaireJsonRpcTransportByChainId())[chainIdFromEvmNetworkId($network)]
						const voltaireBlockWire = await getBlockByNumberForEndpoint({
							...jsonRpcTransport,
							blockNumber: blockNumber,
							fullTransactions: false,
						})
						if (voltaireBlockWire == null) throw new Error('Voltaire_JsonRpc: block not returned from RPC')
						const blockHeader = getRpcHeader(voltaireBlockWire)
						return evmTransactionRefsForTxHashes(
							chainIdFromEvmNetworkId($network),
							blockHeader.transactions
						)
					},
				}
			},
		})({
				$$transactions: (entity) => entity,
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmAccount,
			resolve: {
				AddressInteropAddress: {
					resolve: async ({ address }) => {
						const {
							normalizeEnsName,
							resolveEnsForwardForEndpoint,
							resolveEnsReverseForEndpoint,
						} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
						const { ensTextRecords } = await import('$/constants/Ens.ts')
						const chainId = ChainId.Ethereum
						const jsonRpcTransport = (await voltaireJsonRpcTransportByChainId())[chainId]
						let ensNameFromReverseLookup: string | undefined
						try {
							ensNameFromReverseLookup = (await resolveEnsReverseForEndpoint({
								...jsonRpcTransport,
								address: address,
							})) ?? undefined
						} catch {
							return {}
						}
						if (ensNameFromReverseLookup == null) return {}
						const normalizedPrimaryName = normalizeEnsName(ensNameFromReverseLookup)
						let textRecords: Awaited<ReturnType<typeof resolveEnsForwardForEndpoint>>['textRecords']
						try {
							;({ textRecords } = await resolveEnsForwardForEndpoint({
								...jsonRpcTransport,
								name: normalizedPrimaryName,
								textKeys: ensTextRecords.map((row) => row.key),
							}))
						} catch {
							return {}
						}
						const avatarUrl = ((raw) => (
							raw.length === 0 ?
								undefined
							:
								resolveMediaUrlTransport(raw)?.url
						))(String(textRecords.avatar))
						return {
							...(avatarUrl != null && { avatarUrl }),
							...((avatar) => avatar != null && { $avatar: avatar })(mediaFromUrl(avatarUrl, MediaType.Image)),
						}
					},
				}
			},
		})({
				$avatar: (entity) => entity.$avatar,
				avatarUrl: (entity) => entity.avatarUrl,
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address }, context) => {
						const { getStorageAtForEndpoint } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const chainId = chainIdFromEvmNetworkId($network)
						const jsonRpcTransports = (await voltaireJsonRpcTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmContract.storageSlotReads on chain ${String(chainId)}`)
						const depth = Math.min(32, Math.max(1, resolverContextRowLimit(context)))
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							if (jsonRpcTransport.transportType !== TransportType.Http) continue
							try {
								return await evmContractStorageSlotReadsFromEthGetStorageAt({
									address: address,
									depth,
									getStorageAt: (slotQuantityHex) => (
										getStorageAtForEndpoint({
											...jsonRpcTransport,
											address,
											slotQuantityHex,
											blockTag: 'latest',
										})
									),
								})
							} catch (error) {
								errors.push(`${jsonRpcTransport.endpoint.locator} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmContract.storageSlotReads', errors)
					},
				}
			},
		})({
				storageSlotReads: (entity) => entity,
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address }) => {
						const { getCodeForEndpoint } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const chainId = chainIdFromEvmNetworkId($network)
						const jsonRpcTransports = (await voltaireJsonRpcTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmContract.code on chain ${String(chainId)}`)
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							if (jsonRpcTransport.transportType !== TransportType.Http) continue
							try {
								const codeHex = await getCodeForEndpoint({
									...jsonRpcTransport,
									address: address,
									blockTag: 'latest',
								})
								return evmContractRuntimeCodeFromGetCodeHex(codeHex)
							} catch (error) {
							errors.push(`${jsonRpcTransport.endpoint.locator} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmContract.code', errors)
					},
				}
			},
		})({
				code: (entity) => entity,
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address }) => {
						const { getCodeForEndpoint } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
						const chainId = chainIdFromEvmNetworkId($network)
						const jsonRpcTransports = (await voltaireJsonRpcTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmContract.codeHash on chain ${String(chainId)}`)
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							if (jsonRpcTransport.transportType !== TransportType.Http) continue
							try {
								const codeHex = await getCodeForEndpoint({
									...jsonRpcTransport,
									address: address,
									blockTag: 'latest',
								})
								return evmContractBytecodeHashFromGetCodeHex(codeHex)
							} catch (error) {
							errors.push(`${jsonRpcTransport.endpoint.locator} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmContract.codeHash', errors)
					},
				}
			},
		})({
				codeHash: (entity) => entity,
			}),
	],
}
