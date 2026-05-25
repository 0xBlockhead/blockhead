import { singleFlight } from '$/lib/singleFlight.ts'
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
				const summary = await singleFlight(fetchScalingSummary)()
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
			fieldName: '$parentLayer',
			resolve: async (entityId) => {
				const {
					l2beatHostChainToParentChainId,
					l2BeatProjectIdByChainId,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				const projectId = l2BeatProjectIdByChainId[String(entityId.chainId)]
				if (projectId == null) {
					throw new Error(
						`L2Beat_Rest: no scaling project for chain ${String(entityId.chainId)}`,
					)
				}
				const summary = await singleFlight(fetchScalingSummary)()
				const project = summary.projects[projectId]
				if (project == null || project.isArchived === true) {
					throw new Error(
						`L2Beat_Rest: scaling project archived or missing for chain ${String(entityId.chainId)}`,
					)
				}
				const parentChainId = l2beatHostChainToParentChainId[project.hostChain]
				if (parentChainId == null || parentChainId === entityId.chainId) return undefined
				return {
					[EntityMetaKey.Id]: { chainId: parentChainId },
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$childLayers',
			resolve: async (entityId) => {
				const {
					chainIdByL2BeatProjectId,
					l2beatHostChainToParentChainId,
					l2BeatProjectChainIds,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				const parentChainId = entityId.chainId
				const hostLabels = (
					Object.entries(l2beatHostChainToParentChainId)
						.flatMap(([label, chainId]) => (
							chainId === parentChainId ?
								[label]
							:
								[]
						))
				)
				if (hostLabels.length === 0) return []
				const summary = await singleFlight(fetchScalingSummary)()
				const chainIds = (
					l2BeatProjectChainIds.flatMap(({ projectId }) => {
						const chainId = chainIdByL2BeatProjectId[projectId]
						if (chainId == null || chainId === parentChainId) return []
						const project = summary.projects[projectId]
						if (project == null || project.isArchived === true) return []
						return hostLabels.includes(project.hostChain) ? [chainId] : []
					})
				)
				return chainIds.map((chainId) => ({
					[EntityMetaKey.Id]: { chainId },
				}))
			},
		}),
	],
}
