import { TransportType } from '$/constants/TransportType.ts'
import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { Hex, toBytes } from '@tevm/voltaire/Hex'
import {
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { evmAbiFromJsonString } from '$/lib/evmAbi.ts'
import { hexLowerOfByteSize, with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import type { StreamBlock } from '@tevm/voltaire/block'
import { stringify } from 'devalue'
import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import {
	type Entity,
	type EntityId,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	jsonRpcTransportCandidatesForChain as jsonRpcTransportCandidatesForExecutionChain,
	jsonRpcUrlWithTransportForChain,
} from '$/sources/Evm/JsonRpc/client.ts'
import { rawCallTraceToTraceRoot } from '$/lib/evm-trace.ts'
import type { RpcLog } from '$/sources/Evm/JsonRpc/types.ts'
import type { VoltaireBlockRpc, VoltaireTxRpc } from '$/sources/Voltaire/JsonRpc/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

type EvmNetworkId = {
	caip2: {
		namespace: 'eip155'
		reference: string
	}
}

const evmNetworkIdFromChainId = (chainId: number): EvmNetworkId => ({
	caip2: {
		namespace: 'eip155',
		reference: String(chainId),
	},
})

const chainIdFromEvmNetworkId = (network: EvmNetworkId) => Number(network.caip2.reference)

const evmContractRuntimeCodeFromGetCodeHex = (
	codeHex: `0x${string}`,
): `0x${string}` | undefined => (
	codeHex === '0x' || codeHex === '0x0' ?
		undefined
	:
		zeroExLowerCase(codeHex)
)

const evmContractBytecodeHashFromGetCodeHex = (
	codeHex: `0x${string}`,
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
	const storageSlots: { slot: `0x${string}`; value: `0x${string}` }[] = []
	for (let slotIndex = 0; slotIndex < depth; slotIndex += 1) {
		const slotQuantityHex: `0x${string}` = `0x${BigInt(slotIndex).toString(16).padStart(64, '0')}`
		const valueHex = await getStorageAt(slotQuantityHex)
		const slotNormalized = hexLowerOfByteSize(slotQuantityHex, 32)
		const value = hexLowerOfByteSize(valueHex, 32)
		if (slotNormalized == null || value == null) continue
		storageSlots.push({ slot: slotNormalized, value })
	}
	return storageSlots
}

const evmLogIndexFromWire = (
	raw: string | undefined,
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
				Number(raw),
		)
)

const evmLogRpcQuantityToBigInt = (
	raw: string | undefined,
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
			})() ?? -1n,
		)
)

const evmLogEntityIdFromWire = ({
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
			$network,
			txHash: normalizedTxHash,
			logIndex,
		}
}

const evmLogEntityFromIdAndWire = (
	entityId: Entity<typeof schema, EntityType.EvmLog>[typeof EntityMetaKey.Id],
	log: RpcLog,
): Entity<typeof schema, EntityType.EvmLog> => {
	const address = hexLowerOfByteSize(log.address ?? '', 20)
	const blockHash = hexLowerOfByteSize(log.blockHash ?? '', 32)
	const blockNumber = evmLogRpcQuantityToBigInt(log.blockNumber)
	const transactionIndex = evmLogIndexFromWire(log.transactionIndex)
	const data = log.data == null ? undefined : with0xHex(log.data)
	const topics = (
		(log.topics ?? [])
			.flatMap((topic) => {
				const normalized = hexLowerOfByteSize(topic, 32)
				return normalized == null ? [] : [normalized]
			})
	)
	return {
		[EntityMetaKey.Id]: entityId,
		topics,
		...(data != null && { data }),
		...(blockNumber != null && { blockNumber }),
		...(blockHash != null && { blockHash }),
		...(transactionIndex != null && { transactionIndex }),
		...(log.removed != null && { removed: log.removed }),
		...(address != null && {
			$emitter: {
				[EntityMetaKey.Id]: {
					$network: entityId.$network,
					address,
				},
			} satisfies Entity<typeof schema, EntityType.EvmContract>,
		}),
	}
}

const findReceiptLogWireForEvmLogId = (
	logs: readonly RpcLog[] | undefined,
	logIndex: number,
): RpcLog | undefined => (
	(logs ?? []).find((log) => (
		evmLogIndexFromWire(log.logIndex) === logIndex
	))
)

const evmTransactionEnvelopeTypeFromRpcTypeByte = (
	raw: number | undefined,
): EvmTransactionEnvelopeType | undefined => (
	raw == null || !Number.isFinite(raw) || !Number.isInteger(raw) ?
		EvmTransactionEnvelopeType.Legacy
	: raw === 0 ?
		EvmTransactionEnvelopeType.Legacy
	: raw === 1 ?
		EvmTransactionEnvelopeType.AccessList
	: raw === 2 ?
		EvmTransactionEnvelopeType.FeeMarket
	: raw === 3 ?
		EvmTransactionEnvelopeType.Blob
	: raw === 4 ?
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
	: input != null && input !== '0x' && input.length > 2 ?
		value > 0n ?
			EvmTransactionKind.NativeTransferAndCall
		:
			EvmTransactionKind.ContractCall
	: value > 0n ?
		EvmTransactionKind.NativeTransfer
	:
		EvmTransactionKind.ContractCall
)

const evmBlobEntityRefsFromVoltaireTx = ({
	$network,
	txHash,
	blobVersionedHashes,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	blobVersionedHashes: readonly string[] | undefined
}): Entity<typeof schema, EntityType.EvmBlob>[] => (
	(blobVersionedHashes ?? []).map((_blobVersionedHash, blobIndex) => ({
		[EntityMetaKey.Id]: {
			$network,
			txHash,
			blobIndex,
		},
	}))
)

const errorMessage = (error: unknown) => (
	error instanceof Error ?
		error.message
	:
		(() => {
		try {
			return stringify(error)
		} catch {
			return String(error)
		}
	})()
)

const allJsonRpcEndpointsFailedError = (
	chainId: number,
	fieldName: string,
	errors: readonly string[],
) => (
	new Error(`Voltaire_JsonRpc: all JSON-RPC endpoints failed for Network.${fieldName} on chain ${String(chainId)}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
)

const evmTransactionRefsForTxHashes = (
	chainId: number,
	transactions: readonly (string | VoltaireTxRpc)[] | undefined,
) => (
	(transactions ?? [])
		.map((transactionRef) => (
			typeof transactionRef === 'string' ?
				transactionRef
			: transactionRef.hash != null ?
				transactionRef.hash
			:
				undefined
		))
		.filter((hash): hash is string => hash != null && hash.length > 0)
		.map((hash) => hexLowerOfByteSize(hash, 32))
		.filter((hash): hash is `0x${string}` => hash != null)
		.map((txHash) => ({
			[EntityMetaKey.Id]: {
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
	index: number,
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
	index: number,
) => (
	nonNegativeBigIntFromHex(feeHistory.baseFeePerGas.at(index))
)

const baseFeePerBlobGasAtFromFeeHistory = (
	feeHistory: { baseFeePerBlobGas?: readonly string[] },
	index: number,
) => (
	nonNegativeBigIntFromHex(feeHistory.baseFeePerBlobGas?.at(index))
)

const blobGasUsedRatioAtFromFeeHistory = (
	feeHistory: { blobGasUsedRatio?: readonly (number | string)[] },
	index: number,
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
	index: number,
) => (
	nonNegativeBigIntFromHex(feeHistory.reward?.at(index)?.at(0))
)

const networkGasFeeBlockRefsFromFeeHistory = (
	networkEntityId: EntityId<typeof schema, EntityType.EvmNetwork>,
	feeHistory: {
		oldestBlock: string
		gasUsedRatio: readonly (number | string)[]
	},
) => {
	const oldestBlock = nonNegativeBigIntFromHex(feeHistory.oldestBlock)
	if (oldestBlock == null || feeHistory.gasUsedRatio.length === 0) return []
	return (
		Array.from(
			{ length: feeHistory.gasUsedRatio.length },
			(_entry, index) => ({
				[EntityMetaKey.Id]: {
					$network: networkEntityId,
					blockNumber: oldestBlock + BigInt(index),
				},
			}),
		)
	)
}

const evmBlobEntitiesFromVoltaireBlockWire = (
	chainId: number,
	blockNumber: bigint,
	wire: VoltaireBlockRpc,
): Entity<typeof schema, EntityType.EvmBlob>[] => {
	const txs = wire.transactions ?? []
	const out: Entity<typeof schema, EntityType.EvmBlob>[] = []
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
				[EntityMetaKey.Id]: {
					$network: evmNetworkIdFromChainId(chainId),
					txHash,
					blobIndex,
				},
				$block: {
					[EntityMetaKey.Id]: {
						$network: evmNetworkIdFromChainId(chainId),
						blockNumber,
					},
					number: blockNumber,
				} satisfies Entity<typeof schema, EntityType.EvmBlock>,
				$transaction: {
					[EntityMetaKey.Id]: {
						$network: evmNetworkIdFromChainId(chainId),
						txHash,
					},
				} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
				versionedHash: versionedHash as `0x01${string}`,
			})
		}
	}
	return out
}

const networkScopedEvmBlockFieldsFromVoltaireBlockRpc = (
	chainId: number,
	wire: VoltaireBlockRpc,
) => {
	const blockHash = hexLowerOfByteSize(wire.hash, 32)
	const blockNumber = (() => {
		try {
			return BigInt(wire.number)
		} catch {
			return undefined
		}
	})()
	if (blockNumber == null) {
		return null
	}
	return {
		[EntityMetaKey.Id]: {
			$network: evmNetworkIdFromChainId(chainId),
			blockNumber,
			...(blockHash != null && { hash: blockHash }),
		},
		number: blockNumber,
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					getBlockByNumberForRpcUrl,
					getRpcHeader,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')

				const voltaireBlockWire = await singleFlight(getBlockByNumberForRpcUrl)({
					...jsonRpcTransport,
					blockNumber: entityId.blockNumber,
					fullTransactions: false,
				})
				if (voltaireBlockWire == null) throw new Error('Voltaire_JsonRpc: block not returned from RPC')

				const blockHeader = getRpcHeader(voltaireBlockWire)
				const blockNumber = entityId.blockNumber
				const parentBlockNumber = blockNumber > 0n ? blockNumber - 1n : undefined
				const blockHash = (
					blockHeader.hash != null ?
						hexLowerOfByteSize(blockHeader.hash, 32)
					:
						undefined
				)
				const miner = (
					blockHeader.miner != null ?
						hexLowerOfByteSize(blockHeader.miner, 20)
					:
						undefined
				)
				const timestampSeconds = (
					blockHeader.timestamp != null ? ((parsed) => (
						Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
							parsed
						:
							NaN
					))(Number(blockHeader.timestamp))
					:
						NaN
				)

				const evmBlockEntityBase = {
					[EntityMetaKey.Id]: {
						$network: evmNetworkIdFromChainId(chainIdFromEvmNetworkId(entityId.$network)),
						blockNumber,
						...(blockHash != null && { hash: blockHash }),
					},
					number: blockNumber,
					timestamp: ((timestampSeconds) => (
						Number.isFinite(timestampSeconds) ? timestampSeconds * 1000 : undefined
					))(timestampSeconds),
					gasUsed: (
						blockHeader.gasUsed != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(blockHeader.gasUsed)
							} catch {
								return undefined
							}
						})())
						:
							undefined
					),
					gasLimit: (
						blockHeader.gasLimit != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(blockHeader.gasLimit)
							} catch {
								return undefined
							}
						})())
						:
							undefined
					),
					baseFeePerGas: (
						blockHeader.baseFeePerGas != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(blockHeader.baseFeePerGas)
							} catch {
								return undefined
							}
						})())
						:
							undefined
					),
					blobGasUsed: (
						blockHeader.blobGasUsed != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(blockHeader.blobGasUsed)
							} catch {
								return undefined
							}
						})())
						:
							undefined
					),
					excessBlobGas: (
						blockHeader.excessBlobGas != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(blockHeader.excessBlobGas)
							} catch {
								return undefined
							}
						})())
						:
							undefined
					),
					transactionCount: (blockHeader.transactions ?? []).length,
				}

				const $$transactions = evmTransactionRefsForTxHashes(
					chainIdFromEvmNetworkId(entityId.$network),
					blockHeader.transactions,
				)

				return {
					...evmBlockEntityBase,
					$$transactions,
					...(parentBlockNumber != null && {
							$parent: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									blockNumber: parentBlockNumber,
								},
								number: parentBlockNumber,
							} satisfies Entity<typeof schema, EntityType.EvmBlock>,
						}),
					...(miner != null && {
							$miner: {
								[EntityMetaKey.Id]: {
									address: miner,
								},
							} satisfies Entity<typeof schema, EntityType.EvmAccount>,
						}),
				}
			}
			},
		})({
				fields: {
				$parent: (entity) => entity.$parent,
				$miner: (entity) => entity.$miner,
				$$transactions: (entity) => entity.$$transactions,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmBlob,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getTransactionByHashForRpcUrl } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const tx = await singleFlight(getTransactionByHashForRpcUrl)({
					...jsonRpcTransport,
					txHash: entityId.txHash,
				})
				if (tx == null) throw new Error('Voltaire_JsonRpc: blob transaction not found')
				const bvh = tx.blobVersionedHashes
				if (!Array.isArray(bvh) || typeof bvh[entityId.blobIndex] !== 'string') {
					throw new Error('Voltaire_JsonRpc: blob index missing on transaction')
				}
				const versionedHash = hexLowerOfByteSize(bvh[entityId.blobIndex], 32)
				if (versionedHash == null || !versionedHash.startsWith('0x01')) throw new Error('Voltaire_JsonRpc: invalid blob versioned hash')
				const blockNumber = (() => {
					try {
						return tx.blockNumber != null ? BigInt(tx.blockNumber) : undefined
					} catch {
						return undefined
					}
				})()
				if (blockNumber == null) throw new Error('Voltaire_JsonRpc: blob transaction missing block')
				return {
					[EntityMetaKey.Id]: entityId,
					versionedHash: versionedHash as `0x01${string}`,
					$transaction: {
						[EntityMetaKey.Id]: {
							$network: evmNetworkIdFromChainId(chainId),
							txHash: entityId.txHash,
						},
					} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
					$block: {
						[EntityMetaKey.Id]: {
							$network: evmNetworkIdFromChainId(chainId),
							blockNumber,
						},
						number: blockNumber,
					} satisfies Entity<typeof schema, EntityType.EvmBlock>,
				}
			}
			},
		})({
				fields: {
				$transaction: (entity) => entity.$transaction,
				$block: (entity) => entity.$block,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork_GasFee_Block,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					getBlockNumber,
					getFeeHistory,
					getGasPrice,
					getMaxPriorityFeePerGas,
				} = await import('$/sources/Evm/JsonRpc/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				const jsonRpcTransports = await jsonRpcTransportCandidatesForExecutionChain(chainId)
				if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL for EvmNetwork_GasFee_Block')
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						const feeHistory = await singleFlight(getFeeHistory)({
							rpcUrl: jsonRpcTransport.rpcUrl,
							blockCount: 1,
							newestBlock: entityId.blockNumber,
							rewardPercentiles: [50],
						})
						const headBlockNumber = nonNegativeBigIntFromHex(
							await singleFlight(getBlockNumber)({
								rpcUrl: jsonRpcTransport.rpcUrl,
							}),
						)
						const isHeadBlock = (
							headBlockNumber != null
							&& headBlockNumber === entityId.blockNumber
						)
						let legacyGasPrice: bigint | undefined
						let maxPriorityFeePerGas: bigint | undefined
						if (isHeadBlock) {
							legacyGasPrice = nonNegativeBigIntFromHex(
								await singleFlight(getGasPrice)({
									rpcUrl: jsonRpcTransport.rpcUrl,
								}),
							)
							try {
								maxPriorityFeePerGas = nonNegativeBigIntFromHex(
									await singleFlight(getMaxPriorityFeePerGas)({
										rpcUrl: jsonRpcTransport.rpcUrl,
									}),
								)
							} catch {
								maxPriorityFeePerGas = undefined
							}
						}
						return {
							[EntityMetaKey.Id]: entityId,
							baseFeePerGas: baseFeeAtFromFeeHistory(feeHistory, 0),
							legacyGasPrice,
							maxPriorityFeePerGas,
							gasUsedRatio: gasUsedRatioAtFromFeeHistory(feeHistory, 0),
							priorityFeeRewardAt50thPercentile: priorityRewardAt50thFromFeeHistoryAt(feeHistory, 0),
							baseFeePerBlobGas: baseFeePerBlobGasAtFromFeeHistory(feeHistory, 0),
							blobGasUsedRatio: blobGasUsedRatioAtFromFeeHistory(feeHistory, 0),
						}
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainId, 'EvmNetwork_GasFee_Block', errors)
			}
			},
		})({
				fields: {},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork_Txpool_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getTxpoolStatus } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				const jsonRpcTransports = await jsonRpcTransportCandidatesForExecutionChain(chainId)
				if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL for EvmNetwork_Txpool_Timestamp')
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						const status = await singleFlight(getTxpoolStatus)({
							rpcUrl: jsonRpcTransport.rpcUrl,
						})
						return {
							[EntityMetaKey.Id]: entityId,
							pendingCount: txpoolCountFromHex('pending', status.pending),
							queuedCount: txpoolCountFromHex('queued', status.queued),
						}
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainId, 'EvmNetwork_Txpool_Timestamp', errors)
			}
			},
		})({
				fields: {},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EnsName,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					normalizeEnsName,
					resolveEnsForwardForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
				const { ensEthereumChainId, ensTextRecordKeys } = await import('$/constants/Ens.ts')
				const chainId = ensEthereumChainId
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const normalizedName = normalizeEnsName(entityId.name)
				const resolution = await singleFlight(resolveEnsForwardForRpcUrl)({
					...jsonRpcTransport,
					name: normalizedName,
					textKeys: [...ensTextRecordKeys],
				})
				return {
					name: normalizedName,
					...(Object.keys(resolution.textRecords).length > 0 && { textRecords: resolution.textRecords }),
					...(resolution.contentHash != null && { contentHash: resolution.contentHash }),
					...(resolution.resolverAbiJsonText != null && { resolverAbi: evmAbiFromJsonString(resolution.resolverAbiJsonText) }),
					...(Object.keys(resolution.coinAddresses).length > 0 && { coinAddresses: resolution.coinAddresses }),
					...(resolution.address != null && {
							$resolvedActor: {
								[EntityMetaKey.Id]: {
									address: resolution.address,
								},
							} satisfies Entity<typeof schema, EntityType.EvmAccount>,
						}),
					...(resolution.owner != null && {
							$ownerActor: {
								[EntityMetaKey.Id]: {
									address: resolution.owner,
								},
							} satisfies Entity<typeof schema, EntityType.EvmAccount>,
						}),
					...(resolution.resolver != null && {
							$resolverContract: {
								[EntityMetaKey.Id]: {
									$network: evmNetworkIdFromChainId(ensEthereumChainId),
									address: resolution.resolver,
								},
							} satisfies Entity<typeof schema, EntityType.EvmContract>,
						}),
				}
			}
			},
		})({
				fields: {
				$resolvedActor: (entity) => entity.$resolvedActor,
				$ownerActor: (entity) => entity.$ownerActor,
				$resolverContract: (entity) => entity.$resolverContract,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmActorCoinAllowance,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getCall } = await import('$/sources/Evm/JsonRpc/queries.ts')
				if (entityId.$actorCoin.$coinInstance.type !== CoinInstanceType.Erc20Token) {
					throw new Error('Voltaire_JsonRpc: EvmActorCoinAllowance only supports ERC-20 coin instances')
				}
				const chainId = chainIdFromEvmNetworkId(entityId.$actorCoin.$coinInstance.$network)
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const tokenContract = entityId.$actorCoin.$coinInstance.$contract.address
				const owner = hexLowerOfByteSize(entityId.$actorCoin.$actor.address, 20)
				const spender = hexLowerOfByteSize(entityId.$spender.address, 20)
				if (owner == null || spender == null) {
					throw new Error('Voltaire_JsonRpc: EvmActorCoinAllowance owner or spender address not normalized')
				}
				const allowanceCallData: `0x${string}` = (
					`0xdd62ed3e${`${'0'.repeat(24)}${owner.slice(2).toLowerCase()}`}${`${'0'.repeat(24)}${spender.slice(2).toLowerCase()}`}`
				)
				const raw = await getCall({
					rpcUrl: jsonRpcTransport.rpcUrl,
					to: tokenContract,
					data: allowanceCallData,
				})
				const allowance = (
					raw.startsWith('0x') ?
						BigInt(raw)
					:
						(() => {
							throw new Error('Voltaire_JsonRpc: eth_call allowance returned non-hex')
						})()
				)
				return {
					allowance,
					lastChecked: Date.now(),
				}
			}
			},
		})({
				fields: {},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					debugTraceTransactionForRpcUrl,
					getTransactionByHashForRpcUrl,
					getTransactionReceiptForRpcUrl,
					getRpcReceipt,
					getRpcTx,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const voltaireTransactionWire = await singleFlight(getTransactionByHashForRpcUrl)({
					...jsonRpcTransport,
					txHash: entityId.txHash,
				})
				if (voltaireTransactionWire == null) throw new Error('Voltaire_JsonRpc: transaction not returned from RPC')
				const jsonRpcTransaction = getRpcTx(voltaireTransactionWire, entityId.txHash)
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
						(hexLowerOfByteSize(jsonRpcTransaction.hash, 32) ?? entityId.txHash)
					:
						entityId.txHash
				)
				const from = (
					jsonRpcTransaction.from != null ?
						hexLowerOfByteSize(jsonRpcTransaction.from, 20)
					:
						undefined
				)
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
					[EntityMetaKey.Id]: {
						$network: evmNetworkIdFromChainId(chainId),
						txHash,
					},
					...(containingBlockNumber != null && {
							$block: {
								[EntityMetaKey.Id]: {
									$network: evmNetworkIdFromChainId(chainId),
									blockNumber: containingBlockNumber,
								},
								number: containingBlockNumber,
							} satisfies Entity<typeof schema, EntityType.EvmBlock>,
						}),
					...(from != null && {
							$from: {
								[EntityMetaKey.Id]: {
									address: from,
								},
							} satisfies Entity<typeof schema, EntityType.EvmAccount>,
						}),
					...(to != null && {
							$to: {
								[EntityMetaKey.Id]: {
									address: to,
								},
							} satisfies Entity<typeof schema, EntityType.EvmAccount>,
						}),
					transactionIndex: (
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
						}
					),
				}
				const receiptWire = (
					await singleFlight(getTransactionReceiptForRpcUrl)({
						...jsonRpcTransport,
						txHash: entityId.txHash,
					})
				)
				const receipt = receiptWire == null ? null : getRpcReceipt(receiptWire)
				const createdContractAddress = (
					receipt?.contractAddress != null ?
						hexLowerOfByteSize(receipt.contractAddress, 20)
					:
						undefined
				)
				const rawCallTrace = await singleFlight(debugTraceTransactionForRpcUrl)({
					...jsonRpcTransport,
					txHash: entityId.txHash,
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
					...(receipt?.contractAddress != null && ((address) => (
						address != null && {
							$contract: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									address,
								},
							} satisfies Entity<typeof schema, EntityType.EvmContract>,
						}
					))(createdContractAddress)),
					...(rawCallTrace != null ?
						{
							traceRoot: rawCallTraceToTraceRoot(rawCallTrace),
						}
					:
						{
							traceUnavailable: true,
						}),
				}
			}
			},
		})({
				fields: {
				$block: (entity) => entity.$block,
				$from: (entity) => entity.$from,
				$to: (entity) => entity.$to,
				$contract: (entity) => entity.$contract,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmLog,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					getTransactionReceiptForRpcUrl,
					getRpcReceipt,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const receiptWire = await singleFlight(getTransactionReceiptForRpcUrl)({
					...jsonRpcTransport,
					txHash: entityId.txHash,
				})
				const receipt = receiptWire == null ? null : getRpcReceipt(receiptWire)
				const log = findReceiptLogWireForEvmLogId(receipt?.logs, entityId.logIndex)
				if (log == null) {
					throw new Error('Voltaire_JsonRpc: receipt log not found for EvmLog')
				}
				return evmLogEntityFromIdAndWire(entityId, log)
			}
			},
		})({
				fields: {
				topics: (entity) => entity.topics,
				$emitter: (entity) => entity.$emitter,
			},
			}),
		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async () => ({})
			},
			resolveLive: {
				blockStream: {
					publishes: {
						blockHeight: true,
						gasPrice: true,
						baseFeePerGas: true,
						gasUsedRatio: true,
						'$$blocks': true,
						'$$transactions': true,
						'$$contracts': true,
						'$$blobs': true,
						'$$beaconEpochs': true,
						'$$beaconSlots': true,
					},
					start: (ctx) => {
					console.info('[Voltaire] block stream watch start', {
						entityId: ctx.parentEntityId,
					})
					void (async () => {
						const {
							fields,
							parentEntityId,
							signal,
						} = ctx
						const activityFields = [
							'$$transactions',
							'$$contracts',
							'$$blobs',
						] as const
						const allLiveFieldNames = [
							'blockHeight',
							'gasPrice',
							'baseFeePerGas',
							'gasUsedRatio',
							'$$blocks',
							...activityFields,
							'$$beaconEpochs',
							'$$beaconSlots',
						] as const
						const backstop = setInterval(
							() => { void fields.invalidate(allLiveFieldNames) },
							30_000,
						)
						const clear = () => {
							clearInterval(backstop)
						}
						signal.addEventListener('abort', clear, { once: true })

						const candidateTransports = await jsonRpcTransportCandidatesForExecutionChain(
							chainIdFromEvmNetworkId(parentEntityId),
						)
						if (candidateTransports.length === 0) {
							clear()
							return
						}

						const {
							getChainHeadNumberForRpcUrl,
							getProviderForExecutionUrl,
							iterateBlockStreamEvents,
							streamBlockToBlockRpcWire,
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
									{ once: true },
								)
							})
						)
						const writeRecentBlocksForTransport = async (
							jsonRpcTransport: (typeof candidateTransports)[number],
							recentBlockDepth = 16,
						) => {
							const { getRecentBlockWiresForRpcUrl } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
							const { wires } = await singleFlight(getRecentBlockWiresForRpcUrl)({
								...jsonRpcTransport,
								recentBlockDepth,
							})
							const evmBlockRows = (
								wires.flatMap((wire) => {
									if (wire == null) return []

									const value = networkScopedEvmBlockFieldsFromVoltaireBlockRpc(
										chainIdFromEvmNetworkId(parentEntityId),
										wire,
									)
									return (
										value == null ?
											[]
										:
											[{
												source: Source.Voltaire_JsonRpc,
												value,
											}]
									)
								})
							)
							if (evmBlockRows.length > 0) {
								fields['$$blocks'].replaceRows(evmBlockRows)
							}
						}

						while (!signal.aborted) {
							for (const jsonRpcTransport of candidateTransports) {
								const provider = getProviderForExecutionUrl({
									url: jsonRpcTransport.rpcUrl,
									transportType: jsonRpcTransport.transportType,
								})
								try {
									const currentHead = await getChainHeadNumberForRpcUrl(jsonRpcTransport)
									fields.blockHeight.replaceRows([{
										source: Source.Voltaire_JsonRpc,
										value: currentHead,
									}])
									await writeRecentBlocksForTransport(jsonRpcTransport)
									for await (const event of iterateBlockStreamEvents({
										provider,
										include: 'header',
										signal,
										chainId: chainIdFromEvmNetworkId(parentEntityId),
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
												const chainHead = await getChainHeadNumberForRpcUrl(jsonRpcTransport)
												fields.blockHeight.replaceRows([{
													source: Source.Voltaire_JsonRpc,
													value: chainHead,
												}])
											} catch {
												// invalidate scheduled refetch
											}
											continue
										}

										fields.blockHeight.replaceRows([{
											source: Source.Voltaire_JsonRpc,
											value: event.metadata.chainHead,
										}])
										await fields['$$blocks'].invalidate()

										if (event.blocks.length > 0) {
											const latestBlock = event.blocks[event.blocks.length - 1]
											const latestBlockFields = networkScopedEvmBlockFieldsFromVoltaireBlockRpc(
												chainIdFromEvmNetworkId(parentEntityId),
												streamBlockToBlockRpcWire(latestBlock),
											)
											if (latestBlockFields != null) {
												const baseFeePerGas = latestBlockFields.baseFeePerGas
												const gasUsed = latestBlockFields.gasUsed
												const gasLimit = latestBlockFields.gasLimit
												if (baseFeePerGas != null) {
													fields.baseFeePerGas.replaceRows([{
														source: Source.Voltaire_JsonRpc,
														value: baseFeePerGas,
													}])
												}
												if (gasUsed != null && gasLimit != null && gasLimit !== 0n) {
													fields.gasUsedRatio.replaceRows([{
														source: Source.Voltaire_JsonRpc,
														value: Number(gasUsed) / Number(gasLimit),
													}])
												}
											}

											const evmBlockRows = (
												event.blocks
													.map((block) => {
														const value = networkScopedEvmBlockFieldsFromVoltaireBlockRpc(
															chainIdFromEvmNetworkId(parentEntityId),
															streamBlockToBlockRpcWire(block),
														)
														return (
															value == null ?
																null
															:
																{
																	source: Source.Voltaire_JsonRpc,
																	value,
																}
														)
													})
													.filter((evmBlock): evmBlock is NonNullable<typeof evmBlock> => evmBlock != null)
											)
											if (evmBlockRows.length > 0) {
												fields['$$blocks'].replaceRows(evmBlockRows)
											} else {
												await writeRecentBlocksForTransport(jsonRpcTransport, 1)
											}
										} else {
											await writeRecentBlocksForTransport(jsonRpcTransport, 1)
										}

										if (event.blocks.some((block) => block.body.transactions.length > 0)) {
											await fields.invalidate(activityFields)
										}
									}
								} catch (error) {
									console.warn('Voltaire: block stream ended', {
										error,
										rpcUrl: jsonRpcTransport.rpcUrl,
										transportType: jsonRpcTransport.transportType,
									})
									await waitBeforeRetry(1_000)
								}
							}
						}
					})()
					},
				},
			},
		})({
				fields: {
				blockHeight: (entity) => entity,
				gasPrice: (entity) => entity,
				baseFeePerGas: (entity) => entity,
				gasUsedRatio: (entity) => entity,
				$$gasFeeBlocks: (entity) => entity,
				$$txpoolTimestamps: (entity) => entity,
				$$blocks: (entity) => entity,
				$$blobs: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmAccount,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					normalizeEnsName,
					resolveEnsReverseForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
				const { ensEthereumChainId } = await import('$/constants/Ens.ts')
				const chainId = ensEthereumChainId
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const ensNameFromReverseLookup = await singleFlight(resolveEnsReverseForRpcUrl)({
					...jsonRpcTransport,
					address: entityId.address,
				})
				if (ensNameFromReverseLookup == null) return undefined
				const normalizedPrimaryName = normalizeEnsName(ensNameFromReverseLookup)
				return {
					[EntityMetaKey.Id]: {
						name: normalizedPrimaryName,
					},
				} satisfies Entity<typeof schema, EntityType.EnsName>
			}
			},
		})({
				fields: {
				$primaryName: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getChainHeadNumberForRpcUrl } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransports = await jsonRpcTransportCandidatesForExecutionChain(
					chainIdFromEvmNetworkId(entityId),
				)
				if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.blockHeight on chain ${String(chainIdFromEvmNetworkId(entityId))}`)
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					try {
						return await singleFlight(getChainHeadNumberForRpcUrl)(jsonRpcTransport)
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
						continue
					}
				}
				throw allJsonRpcEndpointsFailedError(chainIdFromEvmNetworkId(entityId), 'blockHeight', errors)
			}
			},
		})({
				fields: {
				blockHeight: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getGasPrice } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const jsonRpcTransports = await jsonRpcTransportCandidatesForExecutionChain(
					chainIdFromEvmNetworkId(entityId),
				)
				if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.gasPrice on chain ${String(chainIdFromEvmNetworkId(entityId))}`)
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						const value = nonNegativeBigIntFromHex(
							await singleFlight(getGasPrice)({
								rpcUrl: jsonRpcTransport.rpcUrl,
							}),
						)
						if (value != null) return value
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): eth_gasPrice returned a non-hex value`)
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
						continue
					}
				}
				throw allJsonRpcEndpointsFailedError(chainIdFromEvmNetworkId(entityId), 'gasPrice', errors)
			}
			},
		})({
				fields: {
				gasPrice: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					getBlockByNumberForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransports = await jsonRpcTransportCandidatesForExecutionChain(
					chainIdFromEvmNetworkId(entityId),
				)
				if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.baseFeePerGas on chain ${String(chainIdFromEvmNetworkId(entityId))}`)
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					try {
						const baseFeePerGas = nonNegativeBigIntFromHex(
							(await singleFlight(getBlockByNumberForRpcUrl)({
								...jsonRpcTransport,
								blockNumber: 'latest',
								fullTransactions: false,
							}))?.baseFeePerGas,
						)
						if (baseFeePerGas != null) return baseFeePerGas
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): latest block missing baseFeePerGas`)
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainIdFromEvmNetworkId(entityId), 'baseFeePerGas', errors)
			}
			},
		})({
				fields: {
				baseFeePerGas: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					getBlockByNumberForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransports = await jsonRpcTransportCandidatesForExecutionChain(
					chainIdFromEvmNetworkId(entityId),
				)
				if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.gasUsedRatio on chain ${String(chainIdFromEvmNetworkId(entityId))}`)
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					try {
						const block = await singleFlight(getBlockByNumberForRpcUrl)({
							...jsonRpcTransport,
							blockNumber: 'latest',
							fullTransactions: false,
						})
						const gasUsed = nonNegativeBigIntFromHex(block?.gasUsed)
						const gasLimit = nonNegativeBigIntFromHex(block?.gasLimit)
						if (gasUsed != null && gasLimit != null && gasLimit !== 0n) return Number(gasUsed) / Number(gasLimit)
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): latest block missing gas usage`)
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainIdFromEvmNetworkId(entityId), 'gasUsedRatio', errors)
			}
			},
		})({
				fields: {
				gasUsedRatio: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getFeeHistory } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const blockCount = Math.min(
					32,
					Math.max(1, resolverContextRowLimit(context)),
				)
				const jsonRpcTransports = await jsonRpcTransportCandidatesForExecutionChain(chainIdFromEvmNetworkId(entityId))
				if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.$$gasFeeBlocks on chain ${String(chainIdFromEvmNetworkId(entityId))}`)
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						const feeHistory = await singleFlight(getFeeHistory)({
							rpcUrl: jsonRpcTransport.rpcUrl,
							blockCount,
							newestBlock: 'latest',
							rewardPercentiles: [50],
						})
						return networkGasFeeBlockRefsFromFeeHistory(entityId, feeHistory)
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainIdFromEvmNetworkId(entityId), '$$gasFeeBlocks', errors)
			}
			},
		})({
				fields: {
				$$gasFeeBlocks: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => (
				[
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			)
			},
		})({
				fields: {
				$$txpoolTimestamps: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const subsetRowLimit = resolverContextRowLimit(context)
				const {
					getRecentBlockWiresForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainIdFromEvmNetworkId(entityId))
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const { blockNumbers, wires } = await singleFlight(getRecentBlockWiresForRpcUrl)({
					...jsonRpcTransport,
					recentBlockDepth: subsetRowLimit,
				})
				return (
					wires
						.flatMap((wire, index) => (
							wire == null ?
								[]
							:
								(() => {
								const blockNumber = blockNumbers[index]
								const value = networkScopedEvmBlockFieldsFromVoltaireBlockRpc(
									chainIdFromEvmNetworkId(entityId),
									{ ...wire, number: String(Hex.fromBigInt(blockNumber)) },
								)
								return value == null ? [] : [value]
							})()
						))
				)
			}
			},
		})({
				fields: {
				$$blocks: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const subsetRowLimit = resolverContextRowLimit(context)
				const {
					getBlockByNumberForRpcUrl,
					getChainHeadNumberForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainIdFromEvmNetworkId(entityId))
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const head = await singleFlight(getChainHeadNumberForRpcUrl)(jsonRpcTransport)
				const depth = Math.min(Math.max(1, subsetRowLimit), 8)
				const blockNumbers = (
					Array.from({ length: depth }, (_, i) => head - BigInt(i))
						.filter((n) => n >= 0n)
				)
				const evmBlobs: Entity<typeof schema, EntityType.EvmBlob>[] = []
				for (const blockNumber of blockNumbers) {
					const w = await singleFlight(getBlockByNumberForRpcUrl)({
						...jsonRpcTransport,
						blockNumber,
						fullTransactions: true,
					})
					if (w == null) continue
					for (const evmBlob of evmBlobEntitiesFromVoltaireBlockWire(chainIdFromEvmNetworkId(entityId), blockNumber, w)) {
						evmBlobs.push(evmBlob)
					}
				}
				return evmBlobs
			}
			},
		})({
				fields: {
				$$blobs: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getTransactionByHashForRpcUrl } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const tx = await singleFlight(getTransactionByHashForRpcUrl)({
					...jsonRpcTransport,
					txHash: entityId.txHash,
				})
				if (tx == null) throw new Error('Voltaire_JsonRpc: transaction not found for blobs')
				return evmBlobEntityRefsFromVoltaireTx({
					$network: entityId.$network,
					txHash: entityId.txHash,
					blobVersionedHashes: tx.blobVersionedHashes,
				})
			}
			},
		})({
				fields: {
				$$blobs: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					getTransactionReceiptForRpcUrl,
					getRpcReceipt,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainIdFromEvmNetworkId(entityId.$network))
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const receiptWire = await singleFlight(getTransactionReceiptForRpcUrl)({
					...jsonRpcTransport,
					txHash: entityId.txHash,
				})
				const receipt = receiptWire == null ? null : getRpcReceipt(receiptWire)
				const entities = (
					(receipt?.logs ?? [])
						.flatMap((log) => {
							const id = evmLogEntityIdFromWire({
								$network: entityId.$network,
								txHash: entityId.txHash,
								log,
							})
							return id == null ?
									[]
								:
									[{
										[EntityMetaKey.Id]: id,
									}]
						})
				)
				return entities
			}
			},
		})({
				fields: {
				$$logs: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					getBlockByNumberForRpcUrl,
					getRpcHeader,
				} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainIdFromEvmNetworkId(entityId.$network))
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				const voltaireBlockWire = await singleFlight(getBlockByNumberForRpcUrl)({
					...jsonRpcTransport,
					blockNumber: entityId.blockNumber,
					fullTransactions: false,
				})
				if (voltaireBlockWire == null) throw new Error('Voltaire_JsonRpc: block not returned from RPC')
				const blockHeader = getRpcHeader(voltaireBlockWire)
				return evmTransactionRefsForTxHashes(
					chainIdFromEvmNetworkId(entityId.$network),
					blockHeader.transactions,
				)
			}
			},
		})({
				fields: {
				$$transactions: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmAccount,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					normalizeEnsName,
					resolveEnsForwardForRpcUrl,
					resolveEnsReverseForRpcUrl,
				} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
				const { ensEthereumChainId, ensTextRecordKeys } = await import('$/constants/Ens.ts')
				const chainId = ensEthereumChainId
				const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
				if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
				let ensNameFromReverseLookup: string | undefined
				try {
					ensNameFromReverseLookup = (await singleFlight(resolveEnsReverseForRpcUrl)({
						...jsonRpcTransport,
						address: entityId.address,
					})) ?? undefined
				} catch {
					return undefined
				}
				if (ensNameFromReverseLookup == null) return undefined
				const normalizedPrimaryName = normalizeEnsName(ensNameFromReverseLookup)
				let textRecords: Awaited<ReturnType<typeof resolveEnsForwardForRpcUrl>>['textRecords']
				try {
					;({ textRecords } = await singleFlight(resolveEnsForwardForRpcUrl)({
					...jsonRpcTransport,
					name: normalizedPrimaryName,
					textKeys: [...ensTextRecordKeys],
					}))
				} catch {
					return undefined
				}
				return ((
					t,
				) => (
					t == null ?
						undefined
					:
						t
				))(
					mediaFromUrl((
						((raw) => (
							raw.length === 0 ?
								undefined
							:
								resolveMediaUrlTransport(raw)?.url
						))(
							String(textRecords.avatar),
						)
					), MediaType.Image),
				)
			}
			},
		})({
				fields: {
				$icon: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getStorageAt } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				const jsonRpcTransports = await jsonRpcTransportCandidatesForExecutionChain(chainId)
				if (jsonRpcTransports.length === 0) {
					throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmContract.storageSlotReads on chain ${String(chainId)}`)
				}
				const depth = Math.min(32, Math.max(1, resolverContextRowLimit(context)))
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						return await evmContractStorageSlotReadsFromEthGetStorageAt({
							address: entityId.address,
							depth,
							getStorageAt: (slotQuantityHex) => (
								singleFlight(getStorageAt)({
									rpcUrl: jsonRpcTransport.rpcUrl,
									address: entityId.address,
									slotQuantityHex,
									blockTag: 'latest',
								})
							),
						})
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainId, 'EvmContract.storageSlotReads', errors)
			}
			},
		})({
				fields: {
				storageSlotReads: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getCode } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				const jsonRpcTransports = await jsonRpcTransportCandidatesForExecutionChain(chainId)
				if (jsonRpcTransports.length === 0) {
					throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmContract.code on chain ${String(chainId)}`)
				}
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						const codeHex = await singleFlight(getCode)({
							rpcUrl: jsonRpcTransport.rpcUrl,
							address: entityId.address,
							blockTag: 'latest',
						})
						return evmContractRuntimeCodeFromGetCodeHex(codeHex)
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainId, 'EvmContract.code', errors)
			}
			},
		})({
				fields: {
				code: (entity) => entity,
			},
			}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getCode } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				const jsonRpcTransports = await jsonRpcTransportCandidatesForExecutionChain(chainId)
				if (jsonRpcTransports.length === 0) {
					throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmContract.codeHash on chain ${String(chainId)}`)
				}
				const errors: string[] = []
				for (const jsonRpcTransport of jsonRpcTransports) {
					if (jsonRpcTransport.transportType !== TransportType.Http) continue
					try {
						const codeHex = await singleFlight(getCode)({
							rpcUrl: jsonRpcTransport.rpcUrl,
							address: entityId.address,
							blockTag: 'latest',
						})
						return evmContractBytecodeHashFromGetCodeHex(codeHex)
					} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
					}
				}
				throw allJsonRpcEndpointsFailedError(chainId, 'EvmContract.codeHash', errors)
			}
			},
		})({
				fields: {
				codeHash: (entity) => entity,
			},
			}),
	],
}
