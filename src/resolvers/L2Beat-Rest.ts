import {
	defineEntityFieldResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.L2Beat_Rest,

	entityResolvers: [],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$networks',
			resolve: async () => {
				const {
					chainIdByL2BeatProjectId,
					ethereumChainId,
					l2BeatProjectChainIds,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				const summary = await fetchScalingSummary()
				return [
					{
						[EntityMetaKey.Id]: { chainId: ethereumChainId },
					},
					...l2BeatProjectChainIds
						.flatMap(({ projectId }) => {
							const chainId = chainIdByL2BeatProjectId[projectId]
							return (
								chainId == null || summary.projects[projectId] == null ?
									[]
								:	[
									{
										[EntityMetaKey.Id]: { chainId },
									},
								]
							)
						}),
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$childNetworks',
			resolve: async (entityId) => {
				const {
					chainIdByL2BeatProjectId,
					ethereumChainId,
					l2BeatProjectChainIds,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				if (entityId.chainId !== ethereumChainId) {
					throw new Error('L2Beat_Rest: child networks are only mapped for Ethereum')
				}
				const summary = await fetchScalingSummary()
				return l2BeatProjectChainIds
					.flatMap(({ projectId }) => {
						const chainId = chainIdByL2BeatProjectId[projectId]
						return (
							chainId == null || summary.projects[projectId] == null ?
								[]
							:	[
								{
									[EntityMetaKey.Id]: { chainId },
								},
							]
						)
					})
			},
		}),
	],
}
