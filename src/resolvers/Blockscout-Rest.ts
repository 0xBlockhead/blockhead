import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { schema } from '$/schema/index.ts'
import type { Entity } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { RpcBlockHeaderWire } from '$/sources/Evm/JsonRpc/types.ts'

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
						typeof wire.hash === 'string' ?
							hexLowerOfByteSize(wire.hash, 32)
						:
							undefined
					)
					const timestampSeconds = (
						typeof wire.timestamp === 'string' ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								NaN
						))(Number(wire.timestamp)) : NaN
					)
					const gasUsed = (
						typeof wire.gasUsed === 'string' ? ((value) => (
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
						typeof wire.gasLimit === 'string' ? ((value) => (
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
						typeof wire.baseFeePerGas === 'string' ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(wire.baseFeePerGas)
							} catch {
								return undefined
							}
						})()) : undefined
					)
					const miner = (
						typeof wire.miner === 'string' ?
							hexLowerOfByteSize(wire.miner, 20)
						:
							undefined
					)
					const base = {
						[EntityMetaKey.Id]: {
							$network: { chainId },
							blockNumber,
							...(blockHash != null ? { hash: blockHash } : {}),
						},
						number: blockNumber,
						timestamp: ((timestampSeconds) => (
							Number.isFinite(timestampSeconds) ? timestampSeconds * 1000 : undefined
						))(timestampSeconds),
						gasUsed,
						gasLimit,
						baseFeePerGas,
						transactionCount: (wire.transactions ?? []).length,
					}
					return {
						...base,
						...(parentBlockNumber != null ?
							{
								$parent: {
									[EntityMetaKey.Id]: {
										$network: { chainId },
										blockNumber: parentBlockNumber,
									},
									number: parentBlockNumber,
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}
						:	{}),
						...(miner != null ?
							{
								$miner: {
									[EntityMetaKey.Id]: {
										address: miner,
									} satisfies Entity<typeof schema, EntityType.Actor>,
								},
							}
						:	{}),
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
					typeof jsonRpcTransaction.blockNumber === 'string' ? ((value) => (
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
					typeof jsonRpcTransaction.hash === 'string' ?
						(hexLowerOfByteSize(jsonRpcTransaction.hash, 32) ?? entityId.txHash)
					:
						entityId.txHash
				)
				const from = (
					typeof jsonRpcTransaction.from === 'string' ?
						hexLowerOfByteSize(jsonRpcTransaction.from, 20)
					:
						undefined
				)
				const to = (
					typeof jsonRpcTransaction.to === 'string' ?
						hexLowerOfByteSize(jsonRpcTransaction.to, 20)
					:
						undefined
				)
				const base = {
					[EntityMetaKey.Id]: {
						$network: { chainId: networkChainId },
						txHash,
					},
					...(containingBlockNumber != null ?
						{
							$block: {
								[EntityMetaKey.Id]: {
									$network: { chainId: networkChainId },
									blockNumber: containingBlockNumber,
								},
								number: containingBlockNumber,
							} satisfies Entity<typeof schema, EntityType.EvmBlock>,
						}
					:	{}),
					...(from != null ?
						{
							$from: {
								[EntityMetaKey.Id]: {
									address: from,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}
					:	{}),
					...(to != null ?
						{
							$to: {
								[EntityMetaKey.Id]: {
									address: to,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}
					:	{}),
					transactionIndex: (
						typeof jsonRpcTransaction.transactionIndex === 'string' ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								undefined
						))(Number(jsonRpcTransaction.transactionIndex)) : undefined
					),
					value: (
						typeof jsonRpcTransaction.value === 'string' ? ((value) => (
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
						typeof jsonRpcTransaction.nonce === 'string' ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								undefined
						))(Number(jsonRpcTransaction.nonce)) : undefined
					),
					...(jsonRpcTransaction.input != null ? { input: jsonRpcTransaction.input } : {}),
					gas: (
						typeof jsonRpcTransaction.gas === 'string' ? ((value) => (
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
						typeof jsonRpcTransaction.gasPrice === 'string' ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(jsonRpcTransaction.gasPrice)
							} catch {
								return undefined
							}
						})()) : undefined
					),
					type: (
						typeof jsonRpcTransaction.type === 'string' ? ((parsed) => (
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
					...(typeof receipt?.status === 'string' ? ((parsed) => (
						Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
							{ status: parsed }
						:
							{}
					))(Number(receipt.status)) : {}),
					...(typeof receipt?.gasUsed === 'string' ? ((value) => (
						value == null || value < 0n ? {} : { gasUsed: value }
					))((() => {
						try {
							return BigInt(receipt.gasUsed)
						} catch {
							return undefined
						}
					})()) : {}),
					...(typeof receipt?.effectiveGasPrice === 'string' ? ((value) => (
						value == null || value < 0n ? {} : { effectiveGasPrice: value }
					))((() => {
						try {
							return BigInt(receipt.effectiveGasPrice)
						} catch {
							return undefined
						}
					})()) : {}),
					...(receipt?.logs != null ? { logs: receipt.logs } : { logs: [] }),
					...(typeof receipt?.contractAddress === 'string' ?
						(() => {
							const address = hexLowerOfByteSize(receipt.contractAddress, 20)
							return address == null ?
									{}
								:	{
										$contract: {
											[EntityMetaKey.Id]: {
												$network: entityId.$network,
												address,
											},
										} satisfies Entity<typeof schema, EntityType.EvmContract>,
									}
						})()
					:	{}),
				}
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
							typeof wire.hash === 'string' ?
								hexLowerOfByteSize(wire.hash, 32)
							:
								undefined
						)
						const timestampSeconds = (
							typeof wire.timestamp === 'string' ? ((parsed) => (
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
									...(blockHash != null ? { hash: blockHash } : {}),
								},
								number: blockNumber,
								timestamp: ((timestampSeconds) => (
									Number.isFinite(timestampSeconds) ? timestampSeconds * 1000 : undefined
								))(timestampSeconds),
								gasUsed: (
									typeof wire.gas_used === 'string' ? ((value) => (
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
									typeof wire.gas_limit === 'string' ? ((value) => (
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
									typeof wire.base_fee_per_gas === 'string' ? ((value) => (
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
							const txHash = typeof wire.hash === 'string' ? hexLowerOfByteSize(wire.hash, 32) : undefined
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
							const txHash = typeof w.hash === 'string' ? hexLowerOfByteSize(w.hash, 32) : undefined
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
	],
}
