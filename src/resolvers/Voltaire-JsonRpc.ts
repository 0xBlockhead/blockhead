import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { ChainId } from '$/constants/ChainId.ts'
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
import { resolveMediaUrlTransport } from '$/lib/media.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import type { StreamBlock } from '@tevm/voltaire/block'
import { stringify } from 'devalue'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import {
	type Entity,
	type EntitySelector,
	type EntitySelectorForSelectorName,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	voltaireJsonRpcTransportCandidatesForChain,
	voltaireJsonRpcUrlWithTransportForChain,
} from '$/sources/Voltaire/index.ts'
import { executionEndpointsByChainId } from '$/sources/Voltaire/JsonRpc/executionEndpoints.ts'
import type { RpcLog } from '$/sources/Evm/JsonRpc/types.ts'
import type {
	VoltaireBlockRpc,
	VoltaireCallTraceRpc,
	VoltaireTxRpc,
} from '$/sources/Voltaire/JsonRpc/types.ts'
import {
	getRpcHeader,
	getRpcReceipt,
	getRpcTx,
} from '$/sources/Voltaire/JsonRpc/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type { EvmTraceTree } from '$/schema/EvmTrace.ts'
import { EvmNetworkSelector } from '$/schema/EvmNetwork.ts'
import { EvmBlockSelector } from '$/schema/EvmBlock.ts'
import { EvmBlobSelector } from '$/schema/EvmBlob.ts'
import { EvmNetwork_GasFee_BlockSelector } from '$/schema/EvmNetwork_GasFee_Block.ts'
import { EvmNetwork_TimestampSelector } from '$/schema/EvmNetwork_Timestamp.ts'
import { EvmNetwork_Txpool_TimestampSelector } from '$/schema/EvmNetwork_Txpool_Timestamp.ts'
import { EnsNameSelector } from '$/schema/EnsName.ts'
import { EvmActorCoinAllowanceSelector } from '$/schema/EvmActorCoinAllowance.ts'
import { EvmTransactionSelector } from '$/schema/EvmTransaction.ts'
import { EvmLogSelector } from '$/schema/EvmLog.ts'
import { EvmAccountSelector } from '$/schema/EvmAccount.ts'
import { EvmContractSelector } from '$/schema/EvmContract.ts'

type EvmNetworkId = EntitySelectorForSelectorName<typeof schema, EntityType.EvmNetwork, EvmNetworkSelector.Caip2>

const evmNetworkIdFromChainId = (chainId: number): EvmNetworkId => ({
	caip2: {
		namespace: 'eip155',
		reference: String(chainId),
	},
})

const evmTraceTreeFromVoltaireCallTrace = (
	call: VoltaireCallTraceRpc,
	index: number
): EvmTraceTree => ({
	index,
	...(call.type != null && { type: call.type }),
	...(call.from != null && { from: call.from as `0x${string}` }),
	...(call.to != null && { to: call.to as `0x${string}` }),
	...(call.value != null && { value: call.value }),
	...(call.gas != null && { gas: BigInt(call.gas) }),
	...(call.gasUsed != null && { gasUsed: BigInt(call.gasUsed) }),
	...(call.input != null && { input: call.input as `0x${string}` }),
	...(call.output != null && { output: call.output as `0x${string}` }),
	...(call.error != null && { error: call.error }),
	...(call.calls != null && {
		children: call.calls.map((child, childIndex) => (
			evmTraceTreeFromVoltaireCallTrace(child, childIndex)
		)),
	}),
})

const chainIdFromEvmNetworkId = (network: EvmNetworkId) => Number(network.caip2.reference)

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
			$network,
			txHash: normalizedTxHash,
			logIndex,
		}
}

const evmLogEntityFromIdAndWire = (
	entitySelector: Entity<typeof schema, EntityType.EvmLog>[typeof EntityMetaKey.Selector],
	log: RpcLog
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
		[EntityMetaKey.Selector]: entitySelector,
		$transaction: {
			[EntityMetaKey.Selector]: {
				$network: entitySelector.$network,
				txHash: entitySelector.txHash,
			},
		} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
		...(blockHash != null && blockNumber != null && {
			$block: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$network,
					hash: blockHash,
				},
				blockNumber,
				number: blockNumber,
			} satisfies Entity<typeof schema, EntityType.EvmBlock>,
		}),
		topics,
		...(data != null && { data }),
		...(blockNumber != null && { blockNumber }),
		...(blockHash != null && { blockHash }),
		...(transactionIndex != null && { transactionIndex }),
		...(log.removed != null && { removed: log.removed }),
		...(address != null && {
			$emitter: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$network,
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
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	blobVersionedHashes: readonly string[] | undefined
}) => (
	(blobVersionedHashes ?? []).map((_blobVersionedHash, blobIndex) => ({
		[EntityMetaKey.Selector]: {
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
	networkEntitySelector: EntitySelector<typeof schema, EntityType.EvmNetwork>,
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
					$network: evmNetworkIdFromChainId(chainId),
					txHash,
					blobIndex,
				},
				$block: {
					[EntityMetaKey.Selector]: {
						$network: evmNetworkIdFromChainId(chainId),
						blockNumber,
					},
					number: blockNumber,
				} satisfies Entity<typeof schema, EntityType.EvmBlock>,
				$transaction: {
					[EntityMetaKey.Selector]: {
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
		hash: blockHash,
		...(parentHash != null && { parentHash }),
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
				[EvmBlockSelector.EvmNetworkBlockNumber]: async ({ $network, blockNumber: blockNumberSelector }) => {
					const {
						getBlockByNumberForRpcUrl,
					} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					const jsonRpcTransport = voltaireJsonRpcUrlWithTransportForChain(chainId)
					if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')

					const voltaireBlockWire = await getBlockByNumberForRpcUrl({
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

					const parentBlockNumber = block.number > 0n ? block.number - 1n : undefined
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
								number: parentBlockNumber,
								hash: block.parentHash,
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
				[EvmBlockSelector.EvmNetworkBlockHash]: async ({ $network, hash }) => {
					const {
						getBlockByHashForRpcUrl,
					} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					const jsonRpcTransport = voltaireJsonRpcUrlWithTransportForChain(chainId)
					if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')

					const voltaireBlockWire = await getBlockByHashForRpcUrl({
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

					const parentBlockNumber = block.number > 0n ? block.number - 1n : undefined
					const miner = hexLowerOfByteSize(voltaireBlockWire.miner, 20)

					return {
						...block,
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
								blockNumber: parentBlockNumber,
								number: parentBlockNumber,
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
		})({
			fields: {
				hash: (entity) => entity.hash,
				parentHash: (entity) => entity.parentHash,
				number: (entity) => entity.number,
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
			},
		}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmBlob,
			resolve: {
				[EvmBlobSelector.EvmNetworkTxHashBlobIndex]: async (entitySelector) => {
					const { getTransactionByHashForRpcUrl } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
					const chainId = chainIdFromEvmNetworkId(entitySelector.$network)
					const jsonRpcTransport = voltaireJsonRpcUrlWithTransportForChain(chainId)
					if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
					const tx = await getTransactionByHashForRpcUrl({
						...jsonRpcTransport,
						txHash: entitySelector.txHash,
					})
					if (tx == null) throw new Error('Voltaire_JsonRpc: blob transaction not found')
					const bvh = tx.blobVersionedHashes
					if (!Array.isArray(bvh) || typeof bvh[entitySelector.blobIndex] !== 'string')
						throw new Error('Voltaire_JsonRpc: blob index missing on transaction')
					const versionedHash = hexLowerOfByteSize(bvh[entitySelector.blobIndex], 32)
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
						[EntityMetaKey.Selector]: entitySelector,
						versionedHash: versionedHash as `0x01${string}`,
						$transaction: {
							[EntityMetaKey.Selector]: {
								$network: evmNetworkIdFromChainId(chainId),
								txHash: entitySelector.txHash,
							},
						} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
						$block: {
							[EntityMetaKey.Selector]: {
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
				versionedHash: (entity) => entity.versionedHash,
				$transaction: (entity) => entity.$transaction,
				$block: (entity) => entity.$block,
			},
		}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork_GasFee_Block,
			resolve: {
				[EvmNetwork_GasFee_BlockSelector.EvmNetworkBlockNumber]: async (entitySelector) => {
					const {
						getBlockNumber,
						getFeeHistory,
						getGasPrice,
						getMaxPriorityFeePerGas,
					} = await import('$/sources/Evm/JsonRpc/queries.ts')
					const chainId = chainIdFromEvmNetworkId(entitySelector.$network)
					const jsonRpcTransports = voltaireJsonRpcTransportCandidatesForChain(chainId)
					if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL for EvmNetwork_GasFee_Block')
					const errors: string[] = []
					for (const jsonRpcTransport of jsonRpcTransports) {
						if (jsonRpcTransport.transportType !== TransportType.Http) continue
						try {
							const feeHistory = await getFeeHistory({
								...jsonRpcTransport,
								blockCount: 1,
								newestBlock: entitySelector.blockNumber,
								rewardPercentiles: [50],
							})
							const headBlockNumber = nonNegativeBigIntFromHex(
								await getBlockNumber({
									...jsonRpcTransport,
								})
						)
							const isHeadBlock = (
								headBlockNumber != null
							&& headBlockNumber === entitySelector.blockNumber
							)
							let legacyGasPrice: bigint | undefined
							let maxPriorityFeePerGas: bigint | undefined
							if (isHeadBlock) {
								legacyGasPrice = nonNegativeBigIntFromHex(
									await getGasPrice({
										...jsonRpcTransport,
									})
							)
								try {
									maxPriorityFeePerGas = nonNegativeBigIntFromHex(
										await getMaxPriorityFeePerGas({
											...jsonRpcTransport,
										})
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
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
						}
					}
					throw allJsonRpcEndpointsFailedError(chainId, 'EvmNetwork_GasFee_Block', errors)
				}
			},
		})({
			fields: {
				baseFeePerGas: (gasFeeBlock) => gasFeeBlock.baseFeePerGas,
				legacyGasPrice: (gasFeeBlock) => gasFeeBlock.legacyGasPrice,
				maxPriorityFeePerGas: (gasFeeBlock) => gasFeeBlock.maxPriorityFeePerGas,
				gasUsedRatio: (gasFeeBlock) => gasFeeBlock.gasUsedRatio,
				priorityFeeRewardAt50thPercentile: (gasFeeBlock) => gasFeeBlock.priorityFeeRewardAt50thPercentile,
				baseFeePerBlobGas: (gasFeeBlock) => gasFeeBlock.baseFeePerBlobGas,
				blobGasUsedRatio: (gasFeeBlock) => gasFeeBlock.blobGasUsedRatio,
			},
		}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork_Txpool_Timestamp,
			resolve: {
				[EvmNetwork_Txpool_TimestampSelector.EvmNetworkTimestampMs]: async (entitySelector) => {
					const { getTxpoolStatus } = await import('$/sources/Evm/JsonRpc/queries.ts')
					const chainId = chainIdFromEvmNetworkId(entitySelector.$network)
					const jsonRpcTransports = voltaireJsonRpcTransportCandidatesForChain(chainId)
					if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL for EvmNetwork_Txpool_Timestamp')
					const errors: string[] = []
					for (const jsonRpcTransport of jsonRpcTransports) {
						if (jsonRpcTransport.transportType !== TransportType.Http) continue
						try {
							const status = await getTxpoolStatus({
								...jsonRpcTransport,
							})
							return {
								[EntityMetaKey.Selector]: entitySelector,
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
			fields: {
				pendingCount: (txpool) => txpool.pendingCount,
				queuedCount: (txpool) => txpool.queuedCount,
			},
		}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EnsName,
			resolve: {
				[EnsNameSelector.NormalizedName]: async ({ name }) => {
					const {
						normalizeEnsName,
						resolveEnsForwardForRpcUrl,
					} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
					const { ensTextRecords } = await import('$/constants/Ens.ts')
					const chainId = ChainId.Ethereum
					const jsonRpcTransport = voltaireJsonRpcUrlWithTransportForChain(chainId)
					if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
					const normalizedName = normalizeEnsName(name)
					const resolution = await resolveEnsForwardForRpcUrl({
						...jsonRpcTransport,
						name: normalizedName,
						textKeys: ensTextRecords.map((row) => row.key),
					})
					return {
						name: normalizedName,
						...(Object.keys(resolution.textRecords).length > 0 && { textRecords: resolution.textRecords }),
						...(resolution.contentHash != null && { contentHash: resolution.contentHash }),
						...(resolution.resolverAbiJsonText != null && { resolverAbi: evmAbiFromJsonString(resolution.resolverAbiJsonText) }),
						...(Object.keys(resolution.coinAddresses).length > 0 && { coinAddresses: resolution.coinAddresses }),
						...(resolution.address != null && {
							$resolvedActor: {
								[EntityMetaKey.Selector]: {
									address: resolution.address,
								},
							} satisfies Entity<typeof schema, EntityType.EvmAccount>,
						}),
						...(resolution.owner != null && {
							$ownerActor: {
								[EntityMetaKey.Selector]: {
									address: resolution.owner,
								},
							} satisfies Entity<typeof schema, EntityType.EvmAccount>,
						}),
						...(resolution.resolver != null && {
							$resolverContract: {
								[EntityMetaKey.Selector]: {
									$network: evmNetworkIdFromChainId(ChainId.Ethereum),
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
				[EvmActorCoinAllowanceSelector.EvmAccountEvmContractSpenderInteropAddress]: async ({ $actor, $contract, $spender }) => {
					const { getCall } = await import('$/sources/Evm/JsonRpc/queries.ts')
					const chainId = chainIdFromEvmNetworkId($contract.$network)
					const jsonRpcTransport = voltaireJsonRpcUrlWithTransportForChain(chainId)
					if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
					const tokenContract = $contract.address
					const owner = hexLowerOfByteSize($actor.address, 20)
					const spender = hexLowerOfByteSize($spender.address, 20)
					if (owner == null || spender == null)
						throw new Error('Voltaire_JsonRpc: EvmActorCoinAllowance owner or spender address not normalized')
					const allowanceCallData: `0x${string}` = (
						`0xdd62ed3e${`${'0'.repeat(24)}${owner.slice(2).toLowerCase()}`}${`${'0'.repeat(24)}${spender.slice(2).toLowerCase()}`}`
					)
					const raw = await getCall({
						...jsonRpcTransport,
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
						$actor,
						$contract,
						$actorCoin: {
							[EntityMetaKey.Selector]: {
								$actor,
								$contract,
							},
						},
						allowance,
						lastChecked: Date.now(),
					}
				}
			},
		})({
			fields: {
				$actor: (allowance) => ({
					[EntityMetaKey.Selector]: allowance.$actor,
				}),
				$contract: (allowance) => ({
					[EntityMetaKey.Selector]: allowance.$contract,
				}),
				$actorCoin: (allowance) => allowance.$actorCoin,
				allowance: (allowance) => allowance.allowance,
				lastChecked: (allowance) => allowance.lastChecked,
			},
		}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				[EvmTransactionSelector.EvmNetworkTxHash]: async ({ $network, txHash: txHashSelector }) => {
					const {
						debugTraceTransactionForRpcUrl,
						getTransactionByHashForRpcUrl,
						getTransactionReceiptForRpcUrl,
					} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					const jsonRpcTransport = voltaireJsonRpcUrlWithTransportForChain(chainId)
					if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
					const voltaireTransactionWire = await getTransactionByHashForRpcUrl({
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
								number: containingBlockNumber,
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
						await getTransactionReceiptForRpcUrl({
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
					const rawCallTrace = await debugTraceTransactionForRpcUrl({
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
						traceRoot: rawCallTrace == null ? undefined : evmTraceTreeFromVoltaireCallTrace(rawCallTrace, 0),
						traceUnavailable: rawCallTrace == null ? true : undefined,
					}
				}
			},
		})({
			fields: {
				$block: (entity) => entity.$block,
				$from: (entity) => entity.$from,
				$to: (entity) => entity.$to,
				$contract: (entity) => entity.$contract,
				transactionIndex: (entity) => entity.transactionIndex,
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
				maxFeePerGas: (entity) => entity.maxFeePerGas,
				maxPriorityFeePerGas: (entity) => entity.maxPriorityFeePerGas,
				blobGasUsed: (entity) => entity.blobGasUsed,
				maxFeePerBlobGas: (entity) => entity.maxFeePerBlobGas,
				$$logs: (entity) => entity.$$logs,
				traceRoot: (entity) => entity.traceRoot,
				traceUnavailable: (entity) => entity.traceUnavailable,
			},
		}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmLog,
			resolve: {
				[EvmLogSelector.EvmNetworkTxHashLogIndex]: async (entitySelector) => {
					const {
						getTransactionReceiptForRpcUrl,
					} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
					const chainId = chainIdFromEvmNetworkId(entitySelector.$network)
					const jsonRpcTransport = voltaireJsonRpcUrlWithTransportForChain(chainId)
					if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
					const receiptWire = await getTransactionReceiptForRpcUrl({
						...jsonRpcTransport,
						txHash: entitySelector.txHash,
					})
					const receipt = receiptWire == null ? null : getRpcReceipt(receiptWire)
					const log = findReceiptLogWireForEvmLogId(receipt?.logs, entitySelector.logIndex)
					if (log == null)
						throw new Error('Voltaire_JsonRpc: receipt log not found for EvmLog')
					return evmLogEntityFromIdAndWire(entitySelector, log)
				}
			},
		})({
			fields: {
				topics: (entity) => entity.topics ?? [],
				$transaction: (entity) => entity.$transaction,
				$block: (entity) => entity.$block,
				data: (entity) => entity.data,
				blockNumber: (entity) => entity.blockNumber,
				blockHash: (entity) => entity.blockHash,
				transactionIndex: (entity) => entity.transactionIndex,
				removed: (entity) => entity.removed,
				$emitter: (entity) => entity.$emitter,
			},
		}),
		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => (
					executionEndpointsByChainId[Number(caip2.reference)] ?? []
				),
			},
		})({
			fields: {
				executionEndpoints: (executionEndpoints) => executionEndpoints,
			},
		}),
		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async () => ({}),
			},
			resolveLive: {
				blockStream: {
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

							const candidateTransports = voltaireJsonRpcTransportCandidatesForChain(
								chainIdFromEvmNetworkId(parentEntitySelector)
							)
							if (candidateTransports.length === 0) {
								clear()
								return
							}

							const {
								getChainHeadNumberForRpcUrl,
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
							const { getRecentBlockWiresForRpcUrl } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
							const { wires } = await getRecentBlockWiresForRpcUrl({
								...jsonRpcTransport,
								recentBlockDepth,
							})
							const evmBlockRows = (
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
												source: Source.Voltaire_JsonRpc,
												value,
											}]
									)
								})
							)
							if (evmBlockRows.length > 0)
								fields['$$blocks'].replaceRows(evmBlockRows)
						}

							while (!signal.aborted) {
								for (const jsonRpcTransport of candidateTransports) {
									const provider = await getProviderForExecutionUrl({
										url: jsonRpcTransport.rpcUrl,
										transportType: jsonRpcTransport.transportType,
									})
									try {
										const currentHead = await getChainHeadNumberForRpcUrl(jsonRpcTransport)
										fields.$$timestamps.replaceRows([{
											source: Source.Voltaire_JsonRpc,
											value: {
												[EntityMetaKey.Selector]: {
													$network: parentEntitySelector,
													timestampMs: Date.now(),
												},
										blockHeight: currentHead,
											},
										}])
										fields.$$blocks.count.replaceRows([{
											source: Source.Voltaire_JsonRpc,
											value: Number(currentHead) + 1,
										}])
										await writeRecentBlocksForTransport(jsonRpcTransport, recentBlockDepth)
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
												const chainHead = await getChainHeadNumberForRpcUrl(jsonRpcTransport)
												fields.$$timestamps.replaceRows([{
													source: Source.Voltaire_JsonRpc,
													value: {
														[EntityMetaKey.Selector]: {
															$network: parentEntitySelector,
															timestampMs: Date.now(),
														},
														blockHeight: chainHead,
													},
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
											value: {
												[EntityMetaKey.Selector]: {
													$network: parentEntitySelector,
													timestampMs: Date.now(),
												},
												blockHeight: event.metadata.chainHead,
											},
										}])
										fields.$$blocks.count.replaceRows([{
											source: Source.Voltaire_JsonRpc,
											value: Number(event.metadata.chainHead) + 1,
										}])
										await writeRecentBlocksForTransport(jsonRpcTransport, recentBlockDepth)

										if (event.blocks.length > 0)
											await fields.invalidate(activityFields)
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
				[EvmAccountSelector.AddressInteropAddress]: async ({ address }) => {
					const {
						normalizeEnsName,
						resolveEnsReverseForRpcUrl,
					} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
					const chainId = ChainId.Ethereum
					const jsonRpcTransport = voltaireJsonRpcUrlWithTransportForChain(chainId)
					if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
					const ensNameFromReverseLookup = await resolveEnsReverseForRpcUrl({
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
				}
			},
		})({
			fields: {
				$primaryName: (entity) => entity,
			},
		}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork_Timestamp,
			resolve: {
				[EvmNetwork_TimestampSelector.EvmNetworkTimestampMs]: async (entitySelector) => {
					const { getChainHeadNumberForRpcUrl } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
					const jsonRpcTransports = voltaireJsonRpcTransportCandidatesForChain(
						chainIdFromEvmNetworkId(entitySelector.$network)
					)
					if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmNetwork_Timestamp.blockHeight on chain ${String(chainIdFromEvmNetworkId(entitySelector.$network))}`)
					const errors: string[] = []
					for (const jsonRpcTransport of jsonRpcTransports) {
						try {
							return {
								[EntityMetaKey.Selector]: entitySelector,
								blockHeight: await getChainHeadNumberForRpcUrl(jsonRpcTransport),
							}
						} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
						continue
						}
					}
					throw allJsonRpcEndpointsFailedError(chainIdFromEvmNetworkId(entitySelector.$network), 'blockHeight', errors)
				}
			},
		})({
			fields: {
				blockHeight: (entity) => entity.blockHeight,
			},
		}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector, context) => {
					const { getFeeHistory } = await import('$/sources/Evm/JsonRpc/queries.ts')
					const blockCount = Math.min(
						32,
						Math.max(1, resolverContextRowLimit(context))
					)
					const jsonRpcTransports = voltaireJsonRpcTransportCandidatesForChain(chainIdFromEvmNetworkId(entitySelector))
					if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.$$gasFeeBlocks on chain ${String(chainIdFromEvmNetworkId(entitySelector))}`)
					const errors: string[] = []
					for (const jsonRpcTransport of jsonRpcTransports) {
						if (jsonRpcTransport.transportType !== TransportType.Http) continue
						try {
							const feeHistory = await getFeeHistory({
								...jsonRpcTransport,
								blockCount,
								newestBlock: 'latest',
								rewardPercentiles: [50],
							})
							return networkGasFeeBlockRefsFromFeeHistory(entitySelector, feeHistory)
						} catch (error) {
						errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
						}
					}
					throw allJsonRpcEndpointsFailedError(chainIdFromEvmNetworkId(entitySelector), '$$gasFeeBlocks', errors)
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
				[EvmNetworkSelector.Caip2]: async (entitySelector) => (
					[
						{
							[EntityMetaKey.Selector]: {
								$network: entitySelector,
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
				[EvmNetworkSelector.Caip2]: async (entitySelector, context) => {
					const subsetRowLimit = resolverContextRowLimit(context)
					const {
						getRecentBlockWiresForRpcUrl,
					} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
					const chainId = chainIdFromEvmNetworkId(entitySelector)
					const jsonRpcTransports = voltaireJsonRpcTransportCandidatesForChain(chainId)
					if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
					const errors: string[] = []
					for (const jsonRpcTransport of jsonRpcTransports) {
						try {
							const { wires } = await getRecentBlockWiresForRpcUrl({
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
											return value == null ? [] : [value]
										})()
									))
							)
						} catch (error) {
							errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
						}
					}
					throw allJsonRpcEndpointsFailedError(chainId, '$$blocks', errors)
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
				[EvmNetworkSelector.Caip2]: async (entitySelector) => {
					const {
						getChainHeadNumberForRpcUrl,
					} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
					const chainId = chainIdFromEvmNetworkId(entitySelector)
					const jsonRpcTransports = voltaireJsonRpcTransportCandidatesForChain(chainId)
					if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
					const errors: string[] = []
					for (const jsonRpcTransport of jsonRpcTransports) {
						try {
							return Number(await getChainHeadNumberForRpcUrl(jsonRpcTransport)) + 1
						} catch (error) {
							errors.push(`${jsonRpcTransport.rpcUrl} (${jsonRpcTransport.transportType}): ${errorMessage(error)}`)
						}
					}
					throw allJsonRpcEndpointsFailedError(chainId, '$$blocks count', errors)
				}
			},
		})({
			fields: {
				$$blocks: {
					resolveCount: (count) => count,
				},
			},
		}),

		defineResolver(Source.Voltaire_JsonRpc, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector, context) => {
					const subsetRowLimit = resolverContextRowLimit(context)
					const {
						getBlockByNumberForRpcUrl,
						getChainHeadNumberForRpcUrl,
					} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
					const jsonRpcTransport = voltaireJsonRpcUrlWithTransportForChain(chainIdFromEvmNetworkId(entitySelector))
					if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
					const head = await getChainHeadNumberForRpcUrl(jsonRpcTransport)
					const depth = Math.min(Math.max(1, subsetRowLimit), 8)
					const blockNumbers = (
						Array.from({ length: depth }, (_, i) => head - BigInt(i))
							.filter((n) => n >= 0n)
					)
						const evmBlobs = []
					for (const blockNumber of blockNumbers) {
						const w = await getBlockByNumberForRpcUrl({
							...jsonRpcTransport,
							blockNumber,
							fullTransactions: true,
						})
						if (w == null) continue
						for (const evmBlob of evmBlobEntitiesFromVoltaireBlockWire(chainIdFromEvmNetworkId(entitySelector), blockNumber, w)) {
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
				[EvmTransactionSelector.EvmNetworkTxHash]: async ({ $network, txHash }) => {
					const { getTransactionByHashForRpcUrl } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					const jsonRpcTransport = voltaireJsonRpcUrlWithTransportForChain(chainId)
					if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
					const tx = await getTransactionByHashForRpcUrl({
						...jsonRpcTransport,
						txHash: txHash,
					})
					if (tx == null) throw new Error('Voltaire_JsonRpc: transaction not found for blobs')
					return evmBlobEntityRefsFromVoltaireTx({
						$network: $network,
						txHash: txHash,
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
				[EvmTransactionSelector.EvmNetworkTxHash]: async ({ $network, txHash }) => {
					const {
						getTransactionReceiptForRpcUrl,
					} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
					const jsonRpcTransport = voltaireJsonRpcUrlWithTransportForChain(chainIdFromEvmNetworkId($network))
					if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
					const receiptWire = await getTransactionReceiptForRpcUrl({
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
				[EvmBlockSelector.EvmNetworkBlockNumber]: async ({ $network, blockNumber }) => {
					const {
						getBlockByNumberForRpcUrl,
					} = await import('$/sources/Voltaire/JsonRpc/queries.ts')
					const jsonRpcTransport = voltaireJsonRpcUrlWithTransportForChain(chainIdFromEvmNetworkId($network))
					if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
					const voltaireBlockWire = await getBlockByNumberForRpcUrl({
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
				[EvmAccountSelector.AddressInteropAddress]: async ({ address }) => {
					const {
						normalizeEnsName,
						resolveEnsForwardForRpcUrl,
						resolveEnsReverseForRpcUrl,
					} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
					const { ensTextRecords } = await import('$/constants/Ens.ts')
					const chainId = ChainId.Ethereum
					const jsonRpcTransport = voltaireJsonRpcUrlWithTransportForChain(chainId)
					if (jsonRpcTransport == null) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
					let ensNameFromReverseLookup: string | undefined
					try {
						ensNameFromReverseLookup = (await resolveEnsReverseForRpcUrl({
							...jsonRpcTransport,
							address: address,
						})) ?? undefined
					} catch {
						return undefined
					}
					if (ensNameFromReverseLookup == null) return undefined
					const normalizedPrimaryName = normalizeEnsName(ensNameFromReverseLookup)
					let textRecords: Awaited<ReturnType<typeof resolveEnsForwardForRpcUrl>>['textRecords']
					try {
						;({ textRecords } = await resolveEnsForwardForRpcUrl({
							...jsonRpcTransport,
							name: normalizedPrimaryName,
							textKeys: ensTextRecords.map((row) => row.key),
						}))
					} catch {
						return undefined
					}
					return ((
						t
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
							String(textRecords.avatar)
						)
						), MediaType.Image)
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
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address }, context) => {
					const { getStorageAt } = await import('$/sources/Evm/JsonRpc/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					const jsonRpcTransports = voltaireJsonRpcTransportCandidatesForChain(chainId)
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
									getStorageAt({
										...jsonRpcTransport,
										address,
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
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address }) => {
					const { getCode } = await import('$/sources/Evm/JsonRpc/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					const jsonRpcTransports = voltaireJsonRpcTransportCandidatesForChain(chainId)
					if (jsonRpcTransports.length === 0)
						throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmContract.code on chain ${String(chainId)}`)
					const errors: string[] = []
					for (const jsonRpcTransport of jsonRpcTransports) {
						if (jsonRpcTransport.transportType !== TransportType.Http) continue
						try {
							const codeHex = await getCode({
								...jsonRpcTransport,
								address: address,
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
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address }) => {
					const { getCode } = await import('$/sources/Evm/JsonRpc/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					const jsonRpcTransports = voltaireJsonRpcTransportCandidatesForChain(chainId)
					if (jsonRpcTransports.length === 0)
						throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmContract.codeHash on chain ${String(chainId)}`)
					const errors: string[] = []
					for (const jsonRpcTransport of jsonRpcTransports) {
						if (jsonRpcTransport.transportType !== TransportType.Http) continue
						try {
							const codeHex = await getCode({
								...jsonRpcTransport,
								address: address,
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
