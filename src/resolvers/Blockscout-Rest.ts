import { stringify } from 'devalue'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { toActorCoinAllowanceEntityId } from '$/schema/ActorCoinAllowance.ts'
import { schema } from '$/schema/index.ts'
import type { Entity } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import { MarketAssetKind, MarketKind } from '$/constants/Market.ts'
import { catalogCoinUsdMarketId } from '$/constants/MarketCatalog.ts'
import { coinTimestampFieldsFromObservation } from '$/resolvers/_coinTimestamp.ts'
import {
	evmContractBytecodeHashFromGetCodeHex,
	evmContractRuntimeCodeFromGetCodeHex,
	evmContractStorageSlotReadsFromEthGetStorageAt,
} from '$/resolvers/_evmContractRpc.ts'
import {
	gasEstimateObservationFromBlockscoutStats,
	networkGasEstimateTimestampFieldsFromObservation,
} from '$/resolvers/_networkGasEstimateTimestamp.ts'
import { marketTimestampFieldsFromObservation } from '$/resolvers/_marketSpotTimestamp.ts'
import type {
	BlockscoutErc4337RegistryEntryWire,
	BlockscoutStatsWire,
} from '$/sources/Blockscout/Rest/types.ts'
import {
	evmLogEntityFromIdAndWire,
	evmLogEntityIdFromWire,
	findReceiptLogWireForEvmLogId,
} from '$/resolvers/_evmLog.ts'
import type { RpcBlockHeaderWire } from '$/sources/Evm/JsonRpc/types.ts'

const usdPriceStringToPrice1e8 = (
	raw: string | undefined,
): bigint | undefined => {
	if (raw == null || raw.trim() === '') return undefined
	const usd = Number(raw)
	return Number.isFinite(usd) && usd >= 0 ?
			BigInt(Math.round(usd * 1e8))
		:	undefined
}

const marketCapUsdFromBlockscoutStats = (
	stats: BlockscoutStatsWire | null,
): number | undefined => {
	const raw = stats?.market_cap
	if (raw == null || raw.trim() === '') return undefined
	const usd = Number(raw)
	return Number.isFinite(usd) && usd >= 0 ?
			usd
		:	undefined
}

const blockscoutStatsForChain = async (
	chainId: number,
): Promise<BlockscoutStatsWire | null> => {
	const {
		blockscoutExplorerOriginForChain,
		blockscoutRestV2AtExplorerOrigin,
	} = await import('$/sources/Blockscout/Rest/constants.ts')
	const { getBlockscoutStats } = await import('$/sources/Blockscout/Rest/queries.ts')
	const origin = blockscoutV2ExplorerOriginWhenRestSupported({
		chainId,
		blockscoutExplorerOriginForChain,
		blockscoutRestV2AtExplorerOrigin,
	})
	if (origin == null) return null
	return singleFlight(getBlockscoutStats)({ explorerOrigin: origin })
}

const blockscoutStatsForNativeCoinId = async (
	coinId: string,
): Promise<BlockscoutStatsWire | null> => {
	const { coinBySymbol } = await import('$/constants/Coin.ts')
	const { blockscoutHostedNetworks } = await import('$/sources/Blockscout/Rest/constants.ts')
	const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
	const chains = await singleFlight(fetchRpcsJson)()
	for (const { chainId } of blockscoutHostedNetworks) {
		const chain = chains.find((candidate) => candidate.chainId === chainId)
		if (chain == null) continue
		const nativeCoinId = coinBySymbol[chain.nativeCurrency.symbol.trim().toUpperCase()]?.id
		if (nativeCoinId !== coinId) continue
		const stats = await blockscoutStatsForChain(chainId)
		if (stats != null) return stats
	}
	return null
}

const blockscoutV2ExplorerOriginWhenRestSupported = ({
	chainId,
	blockscoutExplorerOriginForChain,
	blockscoutRestV2AtExplorerOrigin,
}: {
	chainId: number
	blockscoutExplorerOriginForChain: (chainId: number) => string | undefined
	blockscoutRestV2AtExplorerOrigin: (origin: string) => boolean
}): string | undefined => {
	const origin = blockscoutExplorerOriginForChain(chainId)
	if (origin == null) return undefined
	if (!blockscoutRestV2AtExplorerOrigin(origin)) return undefined
	return origin
}

const userOperationsCountFromBlockscoutRegistryWire = (
	wire: BlockscoutErc4337RegistryEntryWire | null,
) => (
	wire != null
	&& wire.total_ops != null
	&& Number.isFinite(wire.total_ops)
	&& wire.total_ops >= 0 ?
		Math.floor(wire.total_ops)
	:	undefined
)

const erc4337RegistryEntitiesFromBlockscoutWires = <
	_Type extends
		| EntityType.Erc4337SmartAccount
		| EntityType.Erc4337Bundler
		| EntityType.Erc4337Paymaster
		| EntityType.Erc4337AccountFactory,
>({
	chainId,
	items,
}: {
	chainId: number
	items: readonly { address?: { hash?: string } }[]
}) => (
	items.flatMap((row) => {
		const address = hexLowerOfByteSize(row.address?.hash ?? '', 20)
		return address == null ?
				[]
			:	[{
					[EntityMetaKey.Id]: {
						$network: { chainId },
						address,
					},
				} satisfies Entity<typeof schema, _Type>]
	})
)

export default {
	source: Source.Blockscout_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmBlock,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getBlockByNumberBlockscout } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const header = await singleFlight(getBlockByNumberBlockscout)({
					explorerOrigin: origin,
					blockNumber: entityId.blockNumber,
				})
				if (header == null) {
					throw new Error('Blockscout_Rest: block header not returned for EvmBlock')
				}
				const evmBlockEntityFromRpcHeaderWire = ({
					chainId,
					blockNumber,
					wire,
				}: {
					chainId: number
					blockNumber: bigint
					wire: RpcBlockHeaderWire
				}): Entity<typeof schema, EntityType.EvmBlock> => {
					const parentBlockNumber = blockNumber > 0n ? blockNumber - 1n : undefined
					const blockHash = (
						wire.hash != null ?
							hexLowerOfByteSize(wire.hash, 32)
						:
							undefined
					)
					const timestampSeconds = (
						wire.timestamp != null ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								NaN
						))(Number(wire.timestamp)) : NaN
					)
					const gasUsed = (
						wire.gasUsed != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(wire.gasUsed)
							} catch {
								return undefined
							}
						})()) : undefined
					)
					const gasLimit = (
						wire.gasLimit != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(wire.gasLimit)
							} catch {
								return undefined
							}
						})()) : undefined
					)
					const baseFeePerGas = (
						wire.baseFeePerGas != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(wire.baseFeePerGas)
							} catch {
								return undefined
							}
						})()) : undefined
					)
					const blobGasUsed = (
						wire.blobGasUsed != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(wire.blobGasUsed)
							} catch {
								return undefined
							}
						})()) : undefined
					)
					const excessBlobGas = (
						wire.excessBlobGas != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(wire.excessBlobGas)
							} catch {
								return undefined
							}
						})()) : undefined
					)
					const miner = (
						wire.miner != null ?
							hexLowerOfByteSize(wire.miner, 20)
						:
							undefined
					)
					const base = {
						[EntityMetaKey.Id]: {
							$network: { chainId },
							blockNumber,
							...(blockHash != null && { hash: blockHash }),
						},
						number: blockNumber,
						timestamp: ((timestampSeconds) => (
							Number.isFinite(timestampSeconds) ? timestampSeconds * 1000 : undefined
						))(timestampSeconds),
						gasUsed,
						gasLimit,
						baseFeePerGas,
						blobGasUsed,
						excessBlobGas,
						transactionCount: (wire.transactions ?? []).length,
					}
					return {
						...base,
						...(parentBlockNumber != null && {
								$parent: {
									[EntityMetaKey.Id]: {
										$network: { chainId },
										blockNumber: parentBlockNumber,
									},
									number: parentBlockNumber,
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
						...(miner != null && {
								$miner: {
									[EntityMetaKey.Id]: {
										address: miner,
									} satisfies Entity<typeof schema, EntityType.Actor>,
								},
							}),
					}
				}
				return evmBlockEntityFromRpcHeaderWire({
					chainId: entityId.$network.chainId,
					blockNumber: entityId.blockNumber,
					wire: header,
				})
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmTransaction,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getTransactionByHashBlockscout,
					getTransactionReceiptBlockscout,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const jsonRpcTransaction = await singleFlight(getTransactionByHashBlockscout)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
				})
				if (jsonRpcTransaction == null) {
					throw new Error('Blockscout_Rest: transaction not returned for EvmTransaction')
				}
				const networkChainId = entityId.$network.chainId
				const containingBlockNumber = (
					jsonRpcTransaction.blockNumber != null ? ((value) => (
						value == null || value < 0n ? undefined : value
					))((() => {
						try {
							return BigInt(jsonRpcTransaction.blockNumber)
						} catch {
							return undefined
						}
					})()) : undefined
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
				const base = {
					[EntityMetaKey.Id]: {
						$network: { chainId: networkChainId },
						txHash,
					},
					...(containingBlockNumber != null && {
							$block: {
								[EntityMetaKey.Id]: {
									$network: { chainId: networkChainId },
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
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}),
					...(to != null && {
							$to: {
								[EntityMetaKey.Id]: {
									address: to,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}),
					transactionIndex: (
						jsonRpcTransaction.transactionIndex != null ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								undefined
						))(Number(jsonRpcTransaction.transactionIndex)) : undefined
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
						})()) : 0n
					),
					nonce: (
						jsonRpcTransaction.nonce != null ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								undefined
						))(Number(jsonRpcTransaction.nonce)) : undefined
					),
					...(jsonRpcTransaction.input != null && { input: jsonRpcTransaction.input }),
					gas: (
						jsonRpcTransaction.gas != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(jsonRpcTransaction.gas)
							} catch {
								return undefined
							}
						})()) : undefined
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
						})()) : undefined
					),
					maxFeePerGas: (
						jsonRpcTransaction.maxFeePerGas != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(jsonRpcTransaction.maxFeePerGas)
							} catch {
								return undefined
							}
						})()) : undefined
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
						})()) : undefined
					),
					type: (
						jsonRpcTransaction.type != null ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								undefined
						))(Number(jsonRpcTransaction.type)) : undefined
					),
				} satisfies Entity<typeof schema, EntityType.EvmTransaction>
				const receipt = await singleFlight(getTransactionReceiptBlockscout)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
				})
				return {
					...base,
					...(receipt?.status != null && ((parsed) => (
						Number.isFinite(parsed)
						&& Number.isInteger(parsed)
						&& parsed >= 0
						&& { status: parsed }
					))(Number(receipt.status))),
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
					))(hexLowerOfByteSize(receipt.contractAddress, 20))),
					traceUnavailable: true,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmLog,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getTransactionReceiptBlockscout } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const receipt = await singleFlight(getTransactionReceiptBlockscout)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
				})
				const log = findReceiptLogWireForEvmLogId(receipt?.logs, entityId.logIndex)
				if (log == null) {
					throw new Error('Blockscout_Rest: receipt log not found for EvmLog')
				}
				return evmLogEntityFromIdAndWire(entityId, log)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Erc4337SmartAccount,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getBlockscoutErc4337SmartAccountDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wire = await singleFlight(getBlockscoutErc4337SmartAccountDetail)({
					explorerOrigin: origin,
					address: entityId.address,
				})
				const userOperationsCount = userOperationsCountFromBlockscoutRegistryWire(wire)
				return userOperationsCount != null ? { userOperationsCount } : {}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Erc4337Bundler,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getBlockscoutErc4337BundlerDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wire = await singleFlight(getBlockscoutErc4337BundlerDetail)({
					explorerOrigin: origin,
					address: entityId.address,
				})
				const userOperationsCount = userOperationsCountFromBlockscoutRegistryWire(wire)
				return userOperationsCount != null ? { userOperationsCount } : {}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Erc4337Paymaster,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getBlockscoutErc4337PaymasterDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wire = await singleFlight(getBlockscoutErc4337PaymasterDetail)({
					explorerOrigin: origin,
					address: entityId.address,
				})
				const userOperationsCount = userOperationsCountFromBlockscoutRegistryWire(wire)
				return userOperationsCount != null ? { userOperationsCount } : {}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Erc4337AccountFactory,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getBlockscoutErc4337AccountFactoryDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wire = await singleFlight(getBlockscoutErc4337AccountFactoryDetail)({
					explorerOrigin: origin,
					address: entityId.address,
				})
				const userOperationsCount = userOperationsCountFromBlockscoutRegistryWire(wire)
				return userOperationsCount != null ? { userOperationsCount } : {}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmUserOperation,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getBlockscoutUserOperationDetail,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wire = await singleFlight(getBlockscoutUserOperationDetail)({
					explorerOrigin: origin,
					hash: entityId.hash,
				})
				const bundledTransactionHash = (
					wire.transaction_hash != null ?
						hexLowerOfByteSize(wire.transaction_hash, 32)
					:
						undefined
				)
				const senderAddress = hexLowerOfByteSize(wire.address?.hash ?? '', 20)
				const blockNumberRaw = wire.block_number
				const blockNumber = (
					blockNumberRaw === null || blockNumberRaw === undefined ?
						undefined
					: (() => {
						try {
							return BigInt(`${blockNumberRaw}`)
						} catch {
							return undefined
						}
					})()
				)
				const timestampSeconds = (
					wire.timestamp != null ? ((time) => (
						Number.isFinite(time) && time >= 0 ? Math.floor(time / 1000) : undefined
					))(Date.parse(wire.timestamp)) : undefined
				)
				const feeTrimmed = (
					wire.fee != null && wire.fee.trim() !== '' ?
						wire.fee.trim()
					:
						undefined
				)
				return {
					...(bundledTransactionHash != null && { bundledTransactionHash }),
					...(senderAddress != null && {
						$sender: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: senderAddress,
							},
						} satisfies Entity<typeof schema, EntityType.Erc4337SmartAccount>,
					}),
					...(blockNumber != null && { blockNumber }),
					...(timestampSeconds != undefined && { timestampSeconds }),
					...(wire.status === false || wire.status === true ? { finalized: wire.status } : {}),
					...(feeTrimmed != null && { fee: feeTrimmed }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ActorNetwork,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getBlockscoutAddressCounters,
					getBlockscoutAddressDetails,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: ActorNetwork wallet address not normalized')
				}
				const [details, counters] = await Promise.all([
					getBlockscoutAddressDetails({ explorerOrigin: origin, address }),
					getBlockscoutAddressCounters({ explorerOrigin: origin, address }),
				])
				const transactionsCount = (
					counters.transactions_count == null ?
						undefined
					:
						Number(counters.transactions_count)
				)
				const transactionCount = (
					transactionsCount != null && Number.isFinite(transactionsCount) ?
						transactionsCount
					:
						undefined
				)
				const tokenTransferCount = (
					counters.token_transfers_count == null ?
						undefined
					:
						Number(counters.token_transfers_count)
				)
				return {
					...(details.is_contract === true || details.is_contract === false ?
							{ isContract: details.is_contract === true }
						:
							{}),
					...(transactionsCount != null && {
						transactionsCount,
					}),
					...(transactionCount != null && {
						transactionCount,
					}),
					...(tokenTransferCount != null && {
						tokenTransferCount: Number(tokenTransferCount),
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: async (entityId) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Blockscout_Rest: Market_Timestamp is spot-only')
				}
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) {
					throw new Error('Blockscout_Rest: market base is not a catalog coin')
				}
				const catalogMarketId = catalogCoinUsdMarketId(coinId)
				if (stringify(entityId.$market) !== stringify(catalogMarketId)) {
					throw new Error('Blockscout_Rest: Market_Timestamp only supports catalog USD spot markets')
				}
				const stats = await blockscoutStatsForNativeCoinId(coinId)
				const price = usdPriceStringToPrice1e8(stats?.coin_price)
				if (stats == null || price == null) {
					throw new Error(`Blockscout_Rest: Market_Timestamp unsupported for coin ${coinId}`)
				}
				const updatedAtMs = (
					stats.gas_price_updated_at != null ?
						Date.parse(stats.gas_price_updated_at)
					:	NaN
				)
				const timestampMs = (
					Number.isFinite(updatedAtMs) ?
						updatedAtMs
					:	Date.now()
				)
				if (entityId.timestampMs !== timestampMs) {
					throw new Error('Blockscout_Rest: Market_Timestamp id does not match stats clock')
				}
				return marketTimestampFieldsFromObservation({
					timestampMs,
					price,
					transport: 'blockscout-stats-usd-1e8',
					providerAssetId: coinId,
				})
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Network_GasEstimate_Timestamp,
			resolve: async (entityId) => {
				const stats = await blockscoutStatsForChain(entityId.$network.chainId)
				if (stats == null) {
					throw new Error(
						`Blockscout_Rest: Network_GasEstimate_Timestamp unsupported for chain ${String(entityId.$network.chainId)}`,
					)
				}
				const observation = gasEstimateObservationFromBlockscoutStats(stats)
				if (observation == null) {
					throw new Error('Blockscout_Rest: stats missing gas_prices tiers')
				}
				if (entityId.timestampMs !== observation.timestampMs) {
					throw new Error('Blockscout_Rest: Network_GasEstimate_Timestamp id does not match stats clock')
				}
				return networkGasEstimateTimestampFieldsFromObservation(observation)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Coin_Timestamp,
			resolve: async (entityId) => {
				const stats = await blockscoutStatsForNativeCoinId(entityId.$coin.coinId)
				if (stats == null) {
					throw new Error(`Blockscout_Rest: Coin_Timestamp unsupported for coin ${entityId.$coin.coinId}`)
				}
				const updatedAtMs = (
					stats.gas_price_updated_at != null ?
						Date.parse(stats.gas_price_updated_at)
					:	NaN
				)
				const timestampMs = (
					Number.isFinite(updatedAtMs) ?
						updatedAtMs
					:	Date.now()
				)
				if (entityId.timestampMs !== timestampMs) {
					throw new Error('Blockscout_Rest: Coin_Timestamp id does not match stats clock')
				}
				const marketCapUsd = marketCapUsdFromBlockscoutStats(stats)
				return coinTimestampFieldsFromObservation({
					timestampMs,
					...(marketCapUsd != null && {
						marketCap: BigInt(Math.round(marketCapUsd)),
					}),
					...(stats.coin_price_change_percentage != null
						&& Number.isFinite(stats.coin_price_change_percentage) && {
						change24hPercent: stats.coin_price_change_percentage,
					}),
					transport: 'blockscout-stats',
					providerAssetId: entityId.$coin.coinId,
				})
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$blocks',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getBlockscoutBlocks } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutBlocks({ explorerOrigin: origin, limit })
				return (
					wires.flatMap((wire) => {
						const height = wire.height
						const blockNumber = (
							height != null && Number.isFinite(height) && Number.isInteger(height) && height >= 0 ?
								BigInt(height)
							:
								null
						)
						if (blockNumber == null) {
							return []
						}
						const blockHash = (
							wire.hash != null ?
								hexLowerOfByteSize(wire.hash, 32)
							:
								undefined
						)
						const timestampSeconds = (
							wire.timestamp != null ? ((parsed) => (
								Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
									parsed
								:
									NaN
							))(Number(wire.timestamp)) : NaN
						)
						return [
							{
								[EntityMetaKey.Id]: {
									$network: { chainId: entityId.chainId },
									blockNumber,
									...(blockHash != null && { hash: blockHash }),
								},
								number: blockNumber,
								timestamp: ((timestampSeconds) => (
									Number.isFinite(timestampSeconds) ? timestampSeconds * 1000 : undefined
								))(timestampSeconds),
								gasUsed: (
									wire.gas_used != null ? ((value) => (
										value == null || value < 0n ? undefined : value
									))((() => {
										try {
											return BigInt(wire.gas_used)
										} catch {
											return undefined
										}
									})()) : undefined
								),
								gasLimit: (
									wire.gas_limit != null ? ((value) => (
										value == null || value < 0n ? undefined : value
									))((() => {
										try {
											return BigInt(wire.gas_limit)
										} catch {
											return undefined
										}
									})()) : undefined
								),
								baseFeePerGas: (
									wire.base_fee_per_gas != null ? ((value) => (
										value == null || value < 0n ? undefined : value
									))((() => {
										try {
											return BigInt(wire.base_fee_per_gas)
										} catch {
											return undefined
										}
									})()) : undefined
								),
								transactionCount: wire.transactions_count ?? 0,
							} satisfies Entity<typeof schema, EntityType.EvmBlock>,
						]
					})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$transactions',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getBlockscoutTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutTransactions({ explorerOrigin: origin, limit })
				return (
					wires
						.flatMap((wire) => {
							const txHash = wire.hash != null ? hexLowerOfByteSize(wire.hash, 32) : undefined
							return txHash == null ?
									[]
								:	[{
										[EntityMetaKey.Id]: {
											$network: { chainId: entityId.chainId },
											txHash,
										},
									}]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActorNetwork,
			fieldName: '$$transactions',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getBlockscoutAddressTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: ActorNetwork wallet address not normalized')
				}
				const wires = await getBlockscoutAddressTransactions({
					explorerOrigin: origin,
					address,
					limit,
				})
				return (
					wires
						.flatMap((wire) => {
							const txHash = wire.hash != null ? hexLowerOfByteSize(wire.hash, 32) : undefined
							return txHash == null ?
								[]
							:	[{
										[EntityMetaKey.Id]: {
											$network: { chainId: entityId.$network.chainId },
											txHash,
										},
									}]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActorNetwork,
			fieldName: '$$tokenTransfers',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getBlockscoutAddressTokenTransfers,
					uniqueBlockscoutTransactionHashesFromWires,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: ActorNetwork wallet address not normalized')
				}
				const wires = await getBlockscoutAddressTokenTransfers({
					explorerOrigin: origin,
					address,
					limit,
				})
				const hashes = uniqueBlockscoutTransactionHashesFromWires(wires)
				return (
					hashes.map((txHash) => ({
						[EntityMetaKey.Id]: {
							$network: { chainId: entityId.$network.chainId },
							txHash,
						},
					}))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActorNetwork,
			fieldName: '$$internalTransactions',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getBlockscoutAddressInternalTransactions,
					uniqueBlockscoutTransactionHashesFromWires,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: ActorNetwork wallet address not normalized')
				}
				const wires = await getBlockscoutAddressInternalTransactions({
					explorerOrigin: origin,
					address,
					limit,
				})
				const hashes = uniqueBlockscoutTransactionHashesFromWires(wires)
				return (
					hashes.map((txHash) => ({
						[EntityMetaKey.Id]: {
							$network: { chainId: entityId.$network.chainId },
							txHash,
						},
					}))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActorNetwork,
			fieldName: '$$erc20TokenAllowances',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getBlockscoutAddressTokenTransfers } = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wallet = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (wallet == null) {
					throw new Error('Blockscout_Rest: ActorNetwork wallet address not normalized')
				}
				const wires = await getBlockscoutAddressTokenTransfers({
					explorerOrigin: origin,
					address: wallet,
					limit,
				})
				const seen = new Set<string>()
				return (
					wires.flatMap((wire) => {
						const method = wire.method != null ? wire.method.toLowerCase() : ''
						if (method !== 'approve') {
							return []
						}
						const fromHash = (
							wire.from?.hash != null ?
								hexLowerOfByteSize(wire.from.hash, 20)
							:
								undefined
						)
						if (fromHash !== wallet) {
							return []
						}
						const rawToken = wire.token?.address_hash
						const tokenAddr = hexLowerOfByteSize(
							rawToken?.startsWith('0x') ?
								rawToken
							:	`0x${rawToken ?? ''}`,
							20,
						)
						const rawSpender = wire.to?.hash
						const spenderAddr = hexLowerOfByteSize(
							rawSpender?.startsWith('0x') ?
								rawSpender
							:	`0x${rawSpender ?? ''}`,
							20,
						)
						if (tokenAddr == null || spenderAddr == null) {
							return []
						}
						const dedupeKey = `${tokenAddr}:${spenderAddr}`
						if (seen.has(dedupeKey)) {
							return []
						}
						seen.add(dedupeKey)
						return [{
							[EntityMetaKey.Id]: toActorCoinAllowanceEntityId(
								entityId.$network.chainId,
								wallet,
								tokenAddr,
								spenderAddr,
							),
						}]
					})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$contracts',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const {
					evmAddressFromBlockscoutContractListWire,
					getBlockscoutSmartContracts,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const items = await getBlockscoutSmartContracts({ explorerOrigin: origin, limit })
				return (
					items
						.flatMap((w) => {
							const address = evmAddressFromBlockscoutContractListWire(w)
							return address == null ?
								[]
							:	[{
								[EntityMetaKey.Id]: {
									$network: { chainId: entityId.chainId },
									address,
								},
							} satisfies Entity<typeof schema, EntityType.EvmContract>]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$erc4337SmartAccounts',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getBlockscoutErc4337SmartAccountList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutErc4337SmartAccountList({
					explorerOrigin: origin,
					limit,
				})
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337SmartAccount>({
					chainId: entityId.chainId,
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$erc4337Bundlers',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getBlockscoutErc4337BundlerList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutErc4337BundlerList({
					explorerOrigin: origin,
					limit,
				})
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337Bundler>({
					chainId: entityId.chainId,
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$erc4337Paymasters',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getBlockscoutErc4337PaymasterList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutErc4337PaymasterList({
					explorerOrigin: origin,
					limit,
				})
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337Paymaster>({
					chainId: entityId.chainId,
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$erc4337AccountFactories',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getBlockscoutErc4337AccountFactoryList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutErc4337AccountFactoryList({
					explorerOrigin: origin,
					limit,
				})
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337AccountFactory>({
					chainId: entityId.chainId,
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$userOperations',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getBlockscoutUserOperationsPage } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutUserOperationsPage({ explorerOrigin: origin, limit })
				return (
					wires.flatMap((w) => {
						const hashRaw = w.hash != null ? hexLowerOfByteSize(w.hash, 32) : undefined
						return hashRaw == null ?
								[]
							:	[{
									[EntityMetaKey.Id]: {
										$network: { chainId: entityId.chainId },
										hash: hashRaw,
									},
								} satisfies Entity<typeof schema, EntityType.EvmUserOperation>]
					})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$gasEstimateTimestamps',
			resolve: async (entityId) => {
				const stats = await blockscoutStatsForChain(entityId.chainId)
				if (stats == null) return []
				const observation = gasEstimateObservationFromBlockscoutStats(stats)
				if (observation == null) return []
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: observation.timestampMs,
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				const stats = await blockscoutStatsForNativeCoinId(entityId.coinId)
				if (stats == null) return []
				const updatedAtMs = (
					stats.gas_price_updated_at != null ?
						Date.parse(stats.gas_price_updated_at)
					:	NaN
				)
				const timestampMs = (
					Number.isFinite(updatedAtMs) ?
						updatedAtMs
					:	Date.now()
				)
				return [
					{
						[EntityMetaKey.Id]: {
							$coin: { coinId: entityId.coinId },
							timestampMs,
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketPrice,
			fieldName: '$$quotes',
			resolve: async (entityId) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Blockscout_Rest: MarketPrice $$quotes is spot-only')
				}
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) {
					throw new Error('Blockscout_Rest: market base is not a catalog coin')
				}
				const catalogMarketId = catalogCoinUsdMarketId(coinId)
				if (stringify(entityId.$market) !== stringify(catalogMarketId)) {
					return []
				}
				const stats = await blockscoutStatsForNativeCoinId(coinId)
				const price = usdPriceStringToPrice1e8(stats?.coin_price)
				if (stats == null || price == null) return []
				const updatedAtMs = (
					stats.gas_price_updated_at != null ?
						Date.parse(stats.gas_price_updated_at)
					:	NaN
				)
				const timestampMs = (
					Number.isFinite(updatedAtMs) ?
						updatedAtMs
					:	Date.now()
				)
				return [
					{
						[EntityMetaKey.Id]: {
							$market: entityId.$market,
							timestampMs,
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmTransaction,
			fieldName: '$$logs',
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getTransactionReceiptBlockscout } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const receipt = await singleFlight(getTransactionReceiptBlockscout)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
				})
				return (
					(receipt?.logs ?? [])
						.flatMap((log) => {
							const id = evmLogEntityIdFromWire({
								$network: entityId.$network,
								txHash: entityId.txHash,
								log,
							})
							return id == null ?
									[]
								:	[{
										[EntityMetaKey.Id]: id,
									}]
						})
						.sort((
							left,
							right,
						) => (
							left[EntityMetaKey.Id].logIndex - right[EntityMetaKey.Id].logIndex
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmBlock,
			fieldName: '$$transactions',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getBlockTransactionsBlockscout } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wires = await singleFlight(getBlockTransactionsBlockscout)({
					explorerOrigin: origin,
					blockNumber: entityId.blockNumber,
					limit,
				})
				return (
					wires
						.flatMap((w) => {
							const txHash = w.hash != null ? hexLowerOfByteSize(w.hash, 32) : undefined
							return txHash == null ?
									[]
								:	[{
										[EntityMetaKey.Id]: {
											$network: { chainId: entityId.$network.chainId },
											txHash,
										},
									}]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$deployer',
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getBlockscoutAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) return undefined
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) return undefined
				const details = await singleFlight(getBlockscoutAddressDetails)({
					explorerOrigin: origin,
					address,
				})
				const creator = details.creator_address_hash
				if (creator == null) return undefined
				const creatorAddress = hexLowerOfByteSize(creator, 20)
				if (creatorAddress == null) return undefined
				return {
					[EntityMetaKey.Id]: {
						address: creatorAddress,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$creationTransaction',
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getBlockscoutAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) return undefined
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) return undefined
				const details = await singleFlight(getBlockscoutAddressDetails)({
					explorerOrigin: origin,
					address,
				})
				const txHash = details.creation_transaction_hash
				if (txHash == null) return undefined
				const normalized = hexLowerOfByteSize(txHash, 32)
				if (normalized == null) return undefined
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						txHash: normalized,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$implementation',
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getBlockscoutAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) return undefined
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) return undefined
				const details = await singleFlight(getBlockscoutAddressDetails)({
					explorerOrigin: origin,
					address,
				})
				const implementationAddress = details.implementations?.[0]?.address_hash
				if (implementationAddress != null) {
					const normalized = hexLowerOfByteSize(implementationAddress, 20)
					if (normalized != null) {
						return {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: normalized,
							},
						}
					}
				}
				const { getBlockscoutContractSourceCodeRow } = await import('$/sources/Blockscout/Rest/queries.ts')
				const sourceRow = await singleFlight(getBlockscoutContractSourceCodeRow)({
					explorerOrigin: origin,
					address,
				})
				const legacyImplementation = sourceRow?.Implementation
				if (legacyImplementation == null || legacyImplementation.trim() === '') return undefined
				const normalized = hexLowerOfByteSize(legacyImplementation, 20)
				if (normalized == null) return undefined
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						address: normalized,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'abi',
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getBlockscoutContractAbiJsonString } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) return undefined
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) return undefined
				const abi = await singleFlight(getBlockscoutContractAbiJsonString)({
					explorerOrigin: origin,
					address,
				})
				return abi ?? undefined
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'code',
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { blockscoutEthGetCode } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) return undefined
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) return undefined
				const codeHex = await singleFlight(blockscoutEthGetCode)({
					explorerOrigin: origin,
					address,
				})
				if (codeHex == null) return undefined
				return evmContractRuntimeCodeFromGetCodeHex(codeHex)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'bytecodeHash',
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { blockscoutEthGetCode } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) return undefined
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) return undefined
				const codeHex = await singleFlight(blockscoutEthGetCode)({
					explorerOrigin: origin,
					address,
				})
				if (codeHex == null) return undefined
				return evmContractBytecodeHashFromGetCodeHex(codeHex)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'storageSlotReads',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { blockscoutEthGetStorageAt } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) return []
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) return []
				const depth = Math.min(32, Math.max(1, resolverLoadSubsetRowLimit(context)))
				return evmContractStorageSlotReadsFromEthGetStorageAt({
					address,
					depth,
					getStorageAt: (slotQuantityHex) => (
						singleFlight(blockscoutEthGetStorageAt)({
							explorerOrigin: origin,
							address,
							slotQuantityHex,
						}).then((valueHex) => {
							if (valueHex == null) throw new Error('Blockscout_Rest: eth_getStorageAt returned no result')
							return valueHex
						})
					),
				})
			},
		}),
	],
}
