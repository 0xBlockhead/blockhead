import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import {
	type Entity,
	type EntityId,
	schema,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Sources.ts'

const recentTxCap = 20
const recentBlockCap = 12

const explorerContextForChainId = async (chainId: number) => {
	const { evmRpcNetworkByChainId } = await import('$/constants/EvmRpcNetwork.ts')
	const {
		chainPrimaryExplorerUrl,
		chainlistRpcUrlForChainId,
		fetchRpcsJson,
	} = await import('$/sources/Chainlist/Rest/queries.ts')
	const { findChainByChainId } = await import('$/sources/Chainlist/Rest/rpcsJsonWire.ts')
	const rpcNet = evmRpcNetworkByChainId[String(chainId)]
	const chains = await fetchRpcsJson()
	const chain = findChainByChainId(chains, chainId)
	const rpcUrl = rpcNet?.rpcUrl ?? await chainlistRpcUrlForChainId(chainId)
	return {
		explorerOrigin: (
			chain != null ?
				chainPrimaryExplorerUrl(chain) ?? rpcNet?.explorerOrigin
			:	rpcNet?.explorerOrigin
		),
		rpcUrl,
		name: chain != null ? rpcNet?.name ?? chain.name : rpcNet?.name,
		nativeSymbol: chain != null ? rpcNet?.nativeSymbol ?? chain.nativeCurrency.symbol : rpcNet?.nativeSymbol,
	}
}

const evmExplorerRpcUrl = async (chainId: number): Promise<string | undefined> => {
	const ctx = await explorerContextForChainId(chainId)
	return ctx.rpcUrl
}

const explorerReceiptForEvmTx = async (
	entityId: EntityId<typeof schema, EntityType.EvmTransaction>,
) => {
	const { singleFlight } = await import('$/lib/singleFlight.ts')
	const { getTransactionReceiptBlockscout } = await import(
		'$/sources/Blockscout/Rest/queries.ts'
	)
	const rpcUrl = await evmExplorerRpcUrl(entityId.$network.chainId)
	const ctx = await explorerContextForChainId(entityId.$network.chainId)
	if (ctx.explorerOrigin != null) {
		try {
			return await singleFlight(getTransactionReceiptBlockscout)({
				explorerOrigin: ctx.explorerOrigin,
				txHash: entityId.txHash,
			})
		} catch {
			//
		}
	}
	if (rpcUrl == null) return null
	try {
		const { ethGetTransactionReceipt } = await import('$/sources/Evm/JsonRpc/queries.ts')
		return await singleFlight(ethGetTransactionReceipt)({
			rpcUrl,
			txHash: entityId.txHash,
		})
	} catch {
		return null
	}
}

const explorerTransactionForEvmTx = async (
	entityId: EntityId<typeof schema, EntityType.EvmTransaction>,
) => {
	const { singleFlight } = await import('$/lib/singleFlight.ts')
	const { getTransactionByHashBlockscout } = await import(
		'$/sources/Blockscout/Rest/queries.ts'
	)
	const rpcUrl = await evmExplorerRpcUrl(entityId.$network.chainId)
	const ctx = await explorerContextForChainId(entityId.$network.chainId)
	if (ctx.explorerOrigin != null) {
		try {
			return await singleFlight(getTransactionByHashBlockscout)({
				explorerOrigin: ctx.explorerOrigin,
				txHash: entityId.txHash,
			})
		} catch {
			//
		}
	}
	if (rpcUrl == null) return null
	try {
		const { ethGetTransactionByHash } = await import('$/sources/Evm/JsonRpc/queries.ts')
		return await singleFlight(ethGetTransactionByHash)({
			rpcUrl,
			txHash: entityId.txHash,
		})
	} catch {
		return null
	}
}

const explorerBlockForEvmBlock = async (
	entityId: EntityId<typeof schema, EntityType.EvmBlock>,
) => {
	const { singleFlight } = await import('$/lib/singleFlight.ts')
	const {
		getBlockByNumberBlockscout,
		getBlockTransactionsBlockscout,
	} = await import('$/sources/Blockscout/Rest/queries.ts')
	const rpcUrl = await evmExplorerRpcUrl(entityId.$network.chainId)
	const ctx = await explorerContextForChainId(entityId.$network.chainId)
	if (ctx.explorerOrigin != null) {
		try {
			const wire = await singleFlight(getBlockByNumberBlockscout)({
				explorerOrigin: ctx.explorerOrigin,
				blockNumber: entityId.blockNumber,
			})
			if (wire == null) return null
			const transactions = await singleFlight(getBlockTransactionsBlockscout)({
				explorerOrigin: ctx.explorerOrigin,
				blockNumber: entityId.blockNumber,
				limit: recentTxCap,
			})
			const { mapBlockSummary, stubEvmTransactionEntitiesFromBlockTransactions } = await import(
				'$/lib/evmEntityFromWire.ts'
			)
			const number = entityId.blockNumber
			const parentNumber = number > 0n ? number - 1n : undefined
			const base = mapBlockSummary({
				chainId: entityId.$network.chainId,
				blockNumber: number,
				wire,
			})
			return {
				...base,
				$$evmTransactions: stubEvmTransactionEntitiesFromBlockTransactions({
					chainId: entityId.$network.chainId,
					transactions,
					cap: recentTxCap,
				}),
				...(parentNumber != null ?
					{
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								blockNumber: parentNumber,
							},
							number: parentNumber,
						} as Entity<typeof schema, EntityType.EvmBlock>,
					}
				:	{}),
				...(wire.miner != null ?
					{
						$miner: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: wire.miner,
							},
						} as Entity<typeof schema, EntityType.Actor>,
					}
				:	{}),
			}
		} catch {
			//
		}
	}
	if (rpcUrl == null) return null
	try {
		const { mapBlockSummary, stubEvmTransactionEntitiesFromBlockTransactions } = await import(
			'$/lib/evmEntityFromWire.ts'
		)
		const { ethGetBlockByNumber } = await import('$/sources/Evm/JsonRpc/queries.ts')
		const wire = await singleFlight(ethGetBlockByNumber)({
			rpcUrl,
			blockNumber: entityId.blockNumber,
			txObjects: false,
		})
		if (wire == null) return null
		const number = entityId.blockNumber
		const parentNumber = number > 0n ? number - 1n : undefined
		const base = mapBlockSummary({
			chainId: entityId.$network.chainId,
			blockNumber: number,
			wire,
		})
		const $$evmTransactions = stubEvmTransactionEntitiesFromBlockTransactions({
			chainId: entityId.$network.chainId,
			transactions: wire.transactions as unknown[],
			cap: recentTxCap,
		})
		return {
			...base,
			$$evmTransactions,
			...(parentNumber != null ?
				{
					$parent: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							blockNumber: parentNumber,
						},
						number: parentNumber,
					} as Entity<typeof schema, EntityType.EvmBlock>,
				}
			:	{}),
			...(wire.miner != null ?
				{
					$miner: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							address: wire.miner as `0x${string}`,
						},
					} as Entity<typeof schema, EntityType.Actor>,
				}
			:	{}),
		}
	} catch {
		return null
	}
}

const explorerBlocksForNetwork = async (chainId: number) => {
	const { singleFlight } = await import('$/lib/singleFlight.ts')
	const { getBlockscoutBlocks } = await import('$/sources/Blockscout/Rest/queries.ts')
	const ctx = await explorerContextForChainId(chainId)
	if (ctx.explorerOrigin == null) return null
	try {
		return await singleFlight(getBlockscoutBlocks)({
			explorerOrigin: ctx.explorerOrigin,
			limit: recentBlockCap,
		})
	} catch {
		return null
	}
}

const explorerTransactionsForNetwork = async (chainId: number) => {
	const { singleFlight } = await import('$/lib/singleFlight.ts')
	const { getBlockscoutTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
	const ctx = await explorerContextForChainId(chainId)
	if (ctx.explorerOrigin == null) return null
	try {
		return await singleFlight(getBlockscoutTransactions)({
			explorerOrigin: ctx.explorerOrigin,
			limit: recentTxCap,
		})
	} catch {
		return null
	}
}

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Network,
			source: Source.Blockscout,
			resolve: async (entityId) => {
				const ctx = await explorerContextForChainId(entityId.chainId)
				return (
					ctx.name != null ?
						{
							name: ctx.name,
							nativeSymbol: ctx.nativeSymbol,
							explorerOrigin: ctx.explorerOrigin,
							rpcUrl: ctx.rpcUrl,
						}
					:	ctx.rpcUrl != null ?
						{ rpcUrl: ctx.rpcUrl }
					:
						{}
				)
			},
		}),
		defineEntityResolver({
			entityType: EntityType.EvmBlock,
			source: Source.Blockscout,
			resolve: async (entityId) => {
				const rest = await explorerBlockForEvmBlock(entityId)
				if (rest != null) return rest
				return {}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.EvmTransaction,
			source: Source.Blockscout,
			resolve: async (entityId) => {
				const { mapTransactionEntityFromTxWire } = await import('$/lib/evmEntityFromWire.ts')
				const restTx = await explorerTransactionForEvmTx(entityId)
				if (restTx != null) {
					const receipt = await explorerReceiptForEvmTx(entityId)
					const base = mapTransactionEntityFromTxWire({
						chainId: entityId.$network.chainId,
						txHash: entityId.txHash,
						tx: restTx,
					})
					return {
						...base,
						...(receipt?.status != null ?
							{ status: Number.parseInt(receipt.status, 16) }
						:	{}),
						...(receipt?.gasUsed != null ? { gasUsed: BigInt(receipt.gasUsed) } : {}),
						...(receipt?.effectiveGasPrice != null ?
							{ effectiveGasPrice: BigInt(receipt.effectiveGasPrice) }
						:	{}),
						...(receipt?.logs != null ? { logs: receipt.logs } : { logs: [] }),
						...(receipt?.contractAddress != null ?
							{
								$contract: {
									[EntityMetaKey.Id]: {
										$network: entityId.$network,
										address: receipt.contractAddress as `0x${string}`,
									},
								} as Entity<typeof schema, EntityType.EvmContract>,
							}
						:	{}),
					}
				}
				const rpcUrl = await evmExplorerRpcUrl(entityId.$network.chainId)
				if (rpcUrl == null) return {}
				const { ethGetTransactionByHash } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const tx = await ethGetTransactionByHash({
					rpcUrl,
					txHash: entityId.txHash,
				})
				if (tx == null) return {}
				return mapTransactionEntityFromTxWire({
					chainId: entityId.$network.chainId,
					txHash: entityId.txHash,
					tx,
				})
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$evmBlocks',
			source: Source.Blockscout,
			resolve: async (entityId) => {
				const { mapBlockSummary } = await import('$/lib/evmEntityFromWire.ts')
				const rest = await explorerBlocksForNetwork(entityId.chainId)
				if (rest != null) {
					return rest.map((wire) => (
						mapBlockSummary({
							chainId: entityId.chainId,
							blockNumber: BigInt(wire.number ?? '0x0'),
							wire,
						})
					))
				}
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const { ethBlockNumber, ethGetBlockByNumber } = await import(
					'$/sources/Evm/JsonRpc/queries.ts'
				)
				const rpcUrl = await evmExplorerRpcUrl(entityId.chainId)
				if (rpcUrl == null) return undefined
				const headHex = await singleFlight(ethBlockNumber)({ rpcUrl })
				const head = BigInt(headHex)
				const blockNumbers = (
					Array.from(
						{ length: recentBlockCap },
						(_, index) => head - BigInt(index),
					).filter((n) => n >= 0n)
				)
				const blockWires = await Promise.all(
					blockNumbers.map((blockNumber) =>
						singleFlight(ethGetBlockByNumber)({
							rpcUrl,
							blockNumber,
							txObjects: false,
						})
					),
				)
				const $$evmBlocks: Entity<typeof schema, EntityType.EvmBlock>[] = []
				for (let index = 0; index < blockWires.length; index++) {
					const wire = blockWires[index]
					const blockNumber = blockNumbers[index]
					if (wire == null || blockNumber == null) continue
					$$evmBlocks.push(
						mapBlockSummary({
							chainId: entityId.chainId,
							blockNumber,
							wire,
						}),
					)
				}
				return $$evmBlocks
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$evmTransactions',
			source: Source.Blockscout,
			resolve: async (entityId) => {
				const { stubEvmTransactionEntitiesFromBlockTransactions } = await import(
					'$/lib/evmEntityFromWire.ts'
				)
				const rest = await explorerTransactionsForNetwork(entityId.chainId)
				if (rest != null) {
					return stubEvmTransactionEntitiesFromBlockTransactions({
						chainId: entityId.chainId,
						transactions: rest as unknown[],
						cap: recentTxCap,
					})
				}
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const { ethGetBlockByNumber } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const rpcUrl = await evmExplorerRpcUrl(entityId.chainId)
				if (rpcUrl == null) return undefined
				const latestWire = await singleFlight(ethGetBlockByNumber)({
					rpcUrl,
					blockNumber: 'latest',
					txObjects: false,
				})
				if (latestWire == null) return undefined
				return stubEvmTransactionEntitiesFromBlockTransactions({
					chainId: entityId.chainId,
					transactions: latestWire.transactions as unknown[],
					cap: recentTxCap,
				})
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.EvmBlock,
			fieldName: '$$evmTransactions',
			source: Source.Blockscout,
			resolve: async (entityId) => {
				const { stubEvmTransactionEntitiesFromBlockTransactions } = await import(
					'$/lib/evmEntityFromWire.ts'
				)
				const { getBlockTransactionsBlockscout } = await import(
					'$/sources/Blockscout/Rest/queries.ts'
				)
				const ctx = await explorerContextForChainId(entityId.$network.chainId)
				if (ctx.explorerOrigin != null) {
					try {
						const { singleFlight } = await import('$/lib/singleFlight.ts')
						const rest = await singleFlight(getBlockTransactionsBlockscout)({
							explorerOrigin: ctx.explorerOrigin,
							blockNumber: entityId.blockNumber,
							limit: recentTxCap,
						})
						return stubEvmTransactionEntitiesFromBlockTransactions({
							chainId: entityId.$network.chainId,
							transactions: rest as unknown[],
							cap: recentTxCap,
						})
					} catch {
						//
					}
				}
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const { ethGetBlockByNumber } = await import('$/sources/Evm/JsonRpc/queries.ts')
				const rpcUrl = await evmExplorerRpcUrl(entityId.$network.chainId)
				if (rpcUrl == null) return undefined
				const wire = await singleFlight(ethGetBlockByNumber)({
					rpcUrl,
					blockNumber: entityId.blockNumber,
					txObjects: false,
				})
				if (wire == null) return undefined
				return stubEvmTransactionEntitiesFromBlockTransactions({
					chainId: entityId.$network.chainId,
					transactions: wire.transactions as unknown[],
					cap: recentTxCap,
				})
			},
		}),
	],
}
