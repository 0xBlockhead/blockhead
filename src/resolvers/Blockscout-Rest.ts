import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EvmAccountAbstractionRegistryRole } from '$/constants/EvmAccountAbstractionRegistryRole.ts'
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

const accountAbstractionAddressEntitiesFromBlockscoutWires = ({
	chainId,
	items,
	role,
}: {
	chainId: number
	items: readonly { address?: { hash?: string }; total_ops?: number }[]
	role: EvmAccountAbstractionRegistryRole
}) => (
	items.flatMap((row) => {
		const raw = row.address?.hash
		const address = typeof raw === 'string' ? hexLowerOfByteSize(raw, 20) : undefined
		return address == null ?
				[]
			:	[{
					[EntityMetaKey.Id]: {
						$network: { chainId },
						address,
						role,
					},
					...(role === EvmAccountAbstractionRegistryRole.SmartAccount
						&& typeof row.total_ops === 'number'
						&& Number.isFinite(row.total_ops)
						&& row.total_ops >= 0 ?
							{ totalOperations: Math.floor(row.total_ops) }
						:
							{}),
				} satisfies Entity<typeof schema, EntityType.EvmAccountAbstractionAddress>]
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
					const blobGasUsed = (
						typeof wire.blobGasUsed === 'string' ? ((value) => (
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
						typeof wire.excessBlobGas === 'string' ? ((value) => (
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
						typeof wire.miner === 'string' ?
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
					...(jsonRpcTransaction.input != null && { input: jsonRpcTransaction.input }),
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
					...(typeof receipt?.status === 'string' && ((parsed) => (
						Number.isFinite(parsed)
						&& Number.isInteger(parsed)
						&& parsed >= 0
						&& { status: parsed }
					))(Number(receipt.status))),
					...(typeof receipt?.gasUsed === 'string' && ((value) => (
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
					...(typeof receipt?.effectiveGasPrice === 'string' && ((value) => (
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
					...(receipt?.logs != null ? { logs: receipt.logs } : { logs: [] }),
					...(typeof receipt?.contractAddress === 'string' && ((address) => (
						address != null && {
							$contract: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									address,
								},
							} satisfies Entity<typeof schema, EntityType.EvmContract>,
						}
					))(hexLowerOfByteSize(receipt.contractAddress, 20))),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmAccountAbstractionAddress,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getBlockscoutAccountAbstractionAddressDetail,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wire = await singleFlight(getBlockscoutAccountAbstractionAddressDetail)({
					explorerOrigin: origin,
					role: entityId.role,
					address: entityId.address,
				})
				return (
					entityId.role === EvmAccountAbstractionRegistryRole.SmartAccount
					&& typeof wire.total_ops === 'number'
					&& Number.isFinite(wire.total_ops)
					&& wire.total_ops >= 0 ?
						{ totalOperations: Math.floor(wire.total_ops) }
					:
						{}
				)
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
					typeof wire.transaction_hash === 'string' ?
						hexLowerOfByteSize(wire.transaction_hash, 32)
					:
						undefined
				)
				const senderRaw = (
					typeof wire.address === 'object' && wire.address !== null && 'hash' in wire.address ?
						wire.address.hash
					:
						undefined
				)
				const senderAddress = (
					typeof senderRaw === 'string' ?
						hexLowerOfByteSize(senderRaw, 20)
					:
						undefined
				)
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
					typeof wire.timestamp === 'string' ? ((time) => (
						Number.isFinite(time) && time >= 0 ? Math.floor(time / 1000) : undefined
					))(Date.parse(wire.timestamp)) : undefined
				)
				const feeTrimmed = (
					typeof wire.fee === 'string' && wire.fee.trim() !== '' ?
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
						},
					}),
					...(blockNumber != null && { blockNumber }),
					...(timestampSeconds != undefined && { timestampSeconds }),
					...(wire.status === false || wire.status === true ? { finalized: wire.status } : {}),
					...(feeTrimmed != null && { fee: feeTrimmed }),
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
									...(blockHash != null && { hash: blockHash }),
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
							const txHash = typeof wire.hash === 'string' ? hexLowerOfByteSize(wire.hash, 32) : undefined
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
			fieldName: '$$accountAbstractionSmartAccounts',
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
				const { getBlockscoutAccountAbstractionAddressList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutAccountAbstractionAddressList({
					explorerOrigin: origin,
					limit,
					role: EvmAccountAbstractionRegistryRole.SmartAccount,
				})
				return accountAbstractionAddressEntitiesFromBlockscoutWires({
					chainId: entityId.chainId,
					role: EvmAccountAbstractionRegistryRole.SmartAccount,
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$accountAbstractionBundlers',
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
				const { getBlockscoutAccountAbstractionAddressList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutAccountAbstractionAddressList({
					explorerOrigin: origin,
					limit,
					role: EvmAccountAbstractionRegistryRole.Bundler,
				})
				return accountAbstractionAddressEntitiesFromBlockscoutWires({
					chainId: entityId.chainId,
					role: EvmAccountAbstractionRegistryRole.Bundler,
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$accountAbstractionPaymasters',
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
				const { getBlockscoutAccountAbstractionAddressList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutAccountAbstractionAddressList({
					explorerOrigin: origin,
					limit,
					role: EvmAccountAbstractionRegistryRole.Paymaster,
				})
				return accountAbstractionAddressEntitiesFromBlockscoutWires({
					chainId: entityId.chainId,
					role: EvmAccountAbstractionRegistryRole.Paymaster,
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$accountAbstractionFactories',
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
				const { getBlockscoutAccountAbstractionAddressList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutAccountAbstractionAddressList({
					explorerOrigin: origin,
					limit,
					role: EvmAccountAbstractionRegistryRole.Factory,
				})
				return accountAbstractionAddressEntitiesFromBlockscoutWires({
					chainId: entityId.chainId,
					role: EvmAccountAbstractionRegistryRole.Factory,
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
						const hashRaw = typeof w.hash === 'string' ? hexLowerOfByteSize(w.hash, 32) : undefined
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
			fieldName: 'blockscoutStatsJson',
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getBlockscoutStatsJsonString } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) return undefined
				const json = await singleFlight(getBlockscoutStatsJsonString)({ explorerOrigin: origin })
				return json ?? undefined
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
