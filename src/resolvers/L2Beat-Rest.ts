import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const eip155Caip2Namespace: 'eip155' = 'eip155'

export default {
	source: Source.L2Beat_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmRollup,
			resolve: async (entityId) => {
				const {
					l2beatHostChainToParentChainId,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				const summary = await singleFlight(fetchScalingSummary)()
				const project = summary.projects[entityId.projectId]
				if (project == null) {
					throw new Error(
						`L2Beat_Rest: no scaling project ${entityId.projectId}`,
					)
				}
				const settlementChainId = l2beatHostChainToParentChainId[project.hostChain]
				return {
					name: project.name,
					slug: project.slug,
					type: project.type,
					...(project.category != null && { category: project.category }),
					hostChain: project.hostChain,
					...(project.isArchived != null && { isArchived: project.isArchived }),
					...(project.isUpcoming != null && { isUpcoming: project.isUpcoming }),
					...(project.isUnderReview != null && { isUnderReview: project.isUnderReview }),
					...(settlementChainId != null && {
						$settlementNetwork: {
							[EntityMetaKey.Id]: {
								caip2: {
									namespace: eip155Caip2Namespace,
									reference: String(settlementChainId),
								},
							},
						},
					}),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$evmNetworks',
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
						[EntityMetaKey.Id]: {
							caip2: {
								namespace: eip155Caip2Namespace,
								reference: String(ethereumChainId),
							},
						},
					},
					...l2BeatProjectChainIds
						.flatMap(({ projectId }) => {
							const chainId = chainIdByL2BeatProjectId[projectId]
							return (
								chainId == null || summary.projects[projectId] == null ?
									[]
								:	[
									{
										[EntityMetaKey.Id]: {
											caip2: {
												namespace: eip155Caip2Namespace,
												reference: String(chainId),
											},
										},
									},
								]
							)
						}),
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$parent',
			resolve: async (entityId) => {
				const {
					l2beatHostChainToParentChainId,
					l2BeatProjectIdByChainId,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				const projectId = l2BeatProjectIdByChainId[entityId.caip2.reference]
				if (projectId == null) {
					throw new Error(
						`L2Beat_Rest: no scaling project for chain ${entityId.caip2.reference}`,
					)
				}
				const summary = await singleFlight(fetchScalingSummary)()
				const project = summary.projects[projectId]
				if (project == null || project.isArchived === true) {
					throw new Error(
						`L2Beat_Rest: scaling project archived or missing for chain ${entityId.caip2.reference}`,
					)
				}
				const parentChainId = l2beatHostChainToParentChainId[project.hostChain]
				if (parentChainId == null || parentChainId === Number(entityId.caip2.reference)) return undefined
				return {
					[EntityMetaKey.Id]: {
						caip2: {
							namespace: eip155Caip2Namespace,
							reference: String(parentChainId),
						},
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$rollup',
			resolve: async (entityId) => {
				const {
					l2BeatProjectIdByChainId,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				const projectId = l2BeatProjectIdByChainId[entityId.caip2.reference]
				if (projectId == null) {
					throw new Error(
						`L2Beat_Rest: no scaling project for chain ${entityId.caip2.reference}`,
					)
				}
				const summary = await singleFlight(fetchScalingSummary)()
				const project = summary.projects[projectId]
				if (project == null || project.isArchived === true) return undefined
				return {
					[EntityMetaKey.Id]: {
						$network: entityId,
						projectId,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$settledRollups',
			resolve: async (entityId) => {
				const {
					chainIdByL2BeatProjectId,
					l2beatHostChainToParentChainId,
					l2BeatProjectChainIds,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				const parentChainId = Number(entityId.caip2.reference)
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
				return (
					l2BeatProjectChainIds.flatMap(({ projectId }) => {
						const chainId = chainIdByL2BeatProjectId[projectId]
						const project = summary.projects[projectId]
						if (
							chainId == null
							|| project == null
							|| project.isArchived === true
							|| !hostLabels.includes(project.hostChain)
						) return []
						return [
							{
								[EntityMetaKey.Id]: {
									$network: {
										caip2: {
											namespace: eip155Caip2Namespace,
											reference: String(chainId),
										},
									},
									projectId,
								},
							},
						]
					})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$childLayers',
			resolve: async (entityId) => {
				const {
					chainIdByL2BeatProjectId,
					l2beatHostChainToParentChainId,
					l2BeatProjectChainIds,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				const parentChainId = Number(entityId.caip2.reference)
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
					[EntityMetaKey.Id]: {
						caip2: {
							namespace: eip155Caip2Namespace,
							reference: String(chainId),
						},
					},
				}))
			},
		}),
	],
}
