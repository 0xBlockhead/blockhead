import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { coins } from '$/constants/Coin.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Sources.ts'

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.NetworkFork,
			source: Source._Constants,
			resolve: async (entityId) => {
				const { ethereumExecutionForkByChainIdAndForkId } = await import(
					'$/constants/EthereumExecutionForks.ts'
				)
				const hit = ethereumExecutionForkByChainIdAndForkId[
					`${entityId.$network.chainId}:${entityId.forkId}`
				]
				return hit != null ? { ...hit } : {}
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$networkForks',
			source: Source._Constants,
			resolve: async (_entityId) => {
				const { ethereumExecutionForks } = await import('$/constants/EthereumExecutionForks.ts')
				return ethereumExecutionForks.map((row) => ({ ...row }))
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$coins',
			source: Source._Constants,
			resolve: async (_entityId) => (
				coins.map((coin) => (
					{
						[EntityMetaKey.Id]: {
							coinId: coin.id,
						},
					}
				))
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$coinPrices',
			source: Source._Constants,
			resolve: async (_entityId) => (
				coins.map((coin) => (
					{
						[EntityMetaKey.Id]: {
							$coin: {
								coinId: coin.id,
							},
						},
					}
				))
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$forks',
			source: Source._Constants,
			resolve: async (entityId) => {
				const { ethereumExecutionForks } = await import('$/constants/EthereumExecutionForks.ts')
				return (
					ethereumExecutionForks
						.filter((row) => row[EntityMetaKey.Id].$network.chainId === entityId.chainId)
						.map((row) => ({ ...row }))
				)
			},
		}),
	],
}
