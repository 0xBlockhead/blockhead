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
import {
	blockscoutExplorerOriginForChain,
	blockscoutRestV2AtExplorerOrigin,
} from '$/sources/Blockscout/Rest/constants.ts'
import {
	getBlockByNumberBlockscout,
	getBlockscoutBlocks,
	getBlockscoutSmartContracts,
	getBlockscoutTransactions,
	getBlockTransactionsBlockscout,
	getTransactionByHashBlockscout,
	getTransactionReceiptBlockscout,
	evmAddressFromBlockscoutContractListWire,
} from '$/sources/Blockscout/Rest/queries.ts'
import type { RpcBlockHeaderWire } from '$/sources/Evm/JsonRpc/types.ts'
import { Hex } from '@tevm/voltaire/Hex'

const explorerOriginForEntityOrSkip = (chainId: number): string | undefined => {
	const origin = blockscoutExplorerOriginForChain(chainId)
	if (origin == null) return undefined
	if (!blockscoutRestV2AtExplorerOrigin(origin)) return undefined
	return origin
}

const evmBlockEntityFromBlockscoutHeader = ({
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
		typeof wire.hash === 'string' && Hex.isHex(wire.hash) && Hex.size(wire.hash) === 32 ?
			wire.hash.toLowerCase() as `0x${string}`
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
		typeof wire.miner === 'string' && Hex.isHex(wire.miner) && Hex.size(wire.miner) === 20 ?
			wire.miner.toLowerCase() as `0x${string}`
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
						$network: { chainId },
						address: miner,
					} satisfies Entity<typeof schema, EntityType.Actor>,
				},
			}
		:	{}),
	}
}

export default {
	source: Source.Blockscout_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmBlock,
			resolve: async (entityId) => {
				const origin = explorerOriginForEntityOrSkip(entityId.$network.chainId)
				if (origin == null) return {}
				const header = await singleFlight(getBlockByNumberBlockscout)({
					explorerOrigin: origin,
					blockNumber: entityId.blockNumber,
				})
				if (header == null) return {}
				return evmBlockEntityFromBlockscoutHeader({
					chainId: entityId.$network.chainId,
					blockNumber: entityId.blockNumber,
					wire: header,
				})
			},
		}),
		defineEntityResolver({
			entityType: EntityType.EvmTransaction,
			resolve: async (entityId) => {
				const origin = explorerOriginForEntityOrSkip(entityId.$network.chainId)
				if (origin == null) return {}
				const jsonRpcTransaction = await singleFlight(getTransactionByHashBlockscout)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
				})
				if (jsonRpcTransaction == null) return {}
				const receipt = await getTransactionReceiptBlockscout({
					explorerOrigin: origin,
					txHash: entityId.txHash,
				})
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
					typeof jsonRpcTransaction.hash === 'string' && Hex.isHex(jsonRpcTransaction.hash) && Hex.size(jsonRpcTransaction.hash) === 32 ?
						jsonRpcTransaction.hash.toLowerCase() as `0x${string}`
					:
						entityId.txHash
				)
				const from = (
					typeof jsonRpcTransaction.from === 'string' && Hex.isHex(jsonRpcTransaction.from) && Hex.size(jsonRpcTransaction.from) === 20 ?
						jsonRpcTransaction.from.toLowerCase() as `0x${string}`
					:
						undefined
				)
				const to = (
					typeof jsonRpcTransaction.to === 'string' && Hex.isHex(jsonRpcTransaction.to) && Hex.size(jsonRpcTransaction.to) === 20 ?
						jsonRpcTransaction.to.toLowerCase() as `0x${string}`
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
									$network: { chainId: networkChainId },
									address: from,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}
					:	{}),
					...(to != null ?
						{
							$to: {
								[EntityMetaKey.Id]: {
									$network: { chainId: networkChainId },
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
					...(typeof receipt?.contractAddress === 'string' && Hex.isHex(receipt.contractAddress) && Hex.size(receipt.contractAddress) === 20 ?
						{
							$contract: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									address: receipt.contractAddress.toLowerCase() as `0x${string}`,
								},
							} satisfies Entity<typeof schema, EntityType.EvmContract>,
						}
					:	{}),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$evmBlocks',
			resolve: async (entityId, context) => {
				const limit = resolverLoadSubsetRowLimit(context)
				if (limit == null) return []
				const origin = explorerOriginForEntityOrSkip(entityId.chainId)
				if (origin == null) return []
				const wires = await getBlockscoutBlocks({ explorerOrigin: origin, limit })
				return (
					wires.map((wire) => {
						const blockNumber = BigInt(wire.number ?? '0x0')
						const blockHash = (
							typeof wire.hash === 'string' && Hex.isHex(wire.hash) && Hex.size(wire.hash) === 32 ?
								wire.hash.toLowerCase() as `0x${string}`
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
						return {
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
								typeof wire.gasUsed === 'string' ? ((value) => (
									value == null || value < 0n ? undefined : value
								))((() => {
									try {
										return BigInt(wire.gasUsed)
									} catch {
										return undefined
									}
								})()) : undefined
							),
							gasLimit: (
								typeof wire.gasLimit === 'string' ? ((value) => (
									value == null || value < 0n ? undefined : value
								))((() => {
									try {
										return BigInt(wire.gasLimit)
									} catch {
										return undefined
									}
								})()) : undefined
							),
							baseFeePerGas: (
								typeof wire.baseFeePerGas === 'string' ? ((value) => (
									value == null || value < 0n ? undefined : value
								))((() => {
									try {
										return BigInt(wire.baseFeePerGas)
									} catch {
										return undefined
									}
								})()) : undefined
							),
							transactionCount: (wire.transactions ?? []).length,
						} satisfies Entity<typeof schema, EntityType.EvmBlock>
					})
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$evmTransactions',
			resolve: async (entityId, context) => {
				const limit = resolverLoadSubsetRowLimit(context)
				if (limit == null) return []
				const origin = explorerOriginForEntityOrSkip(entityId.chainId)
				if (origin == null) return []
				const wires = await getBlockscoutTransactions({ explorerOrigin: origin, limit })
				return (
					wires
						.flatMap((wire) => (
							typeof wire.hash === 'string' && Hex.isHex(wire.hash) && Hex.size(wire.hash) === 32 ?
								[{
									[EntityMetaKey.Id]: {
										$network: { chainId: entityId.chainId },
										txHash: wire.hash.toLowerCase() as `0x${string}`,
									},
								}]
							:
								[]
						))
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$evmContracts',
			resolve: async (entityId, context) => {
				const limit = resolverLoadSubsetRowLimit(context)
				if (limit == null) return []
				const origin = explorerOriginForEntityOrSkip(entityId.chainId)
				if (origin == null) return []
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
			fieldName: '$$evmTransactions',
			resolve: async (entityId, context) => {
				const limit = resolverLoadSubsetRowLimit(context)
				if (limit == null) return []
				const origin = explorerOriginForEntityOrSkip(entityId.$network.chainId)
				if (origin == null) return []
				const wires = await singleFlight(getBlockTransactionsBlockscout)({
					explorerOrigin: origin,
					blockNumber: entityId.blockNumber,
					limit,
				})
				return (
					wires
						.flatMap((w) => (
							typeof w.hash === 'string' && Hex.isHex(w.hash) && Hex.size(w.hash) === 32 ?
								[{
									[EntityMetaKey.Id]: {
										$network: { chainId: entityId.$network.chainId },
										txHash: w.hash.toLowerCase() as `0x${string}`,
									},
								}]
							:
								[]
						))
				)
			},
		}),
	],
}
