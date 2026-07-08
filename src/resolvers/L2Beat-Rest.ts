import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { EvmRollupSelector } from '$/schema/EvmRollup.ts'

export default {
	source: Source.L2Beat_Rest,

	resolvers: [
		defineResolver(Source.L2Beat_Rest, {
			entityType: EntityType.EvmRollup,
			resolve: {
				[EvmRollupSelector.EvmNetworkProjectId]: async ({ projectId }) => {
				const {
					l2beatHostChainToParentChainId,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				const summary = await fetchScalingSummary()
				const project = summary.projects[projectId]
				if (project == null) throw new Error('L2Beat_Rest: rollup project not found')
				const settlementChainId = l2beatHostChainToParentChainId[project.hostChain]
				return {
					name: project.name,
					slug: project.slug,
					type: project.type,
					...(project.category != null && { category: project.category }),
					hostChain: project.hostChain,
					$settlementNetwork: {
						[EntityMetaKey.Selector]: {
							caip2: {
								namespace: 'eip155' as const,
								reference: String(settlementChainId),
							},
						},
					},
				}
			}
			}
		})({
			name: (snapshot) => snapshot.name,
			slug: (snapshot) => snapshot.slug,
			type: (snapshot) => snapshot.type,
			category: (snapshot) => snapshot.category,
			hostChain: (snapshot) => snapshot.hostChain,
			$settlementNetwork: (snapshot) => snapshot.$settlementNetwork,
		}),

		defineResolver(Source.L2Beat_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async () => {
				const {
					chainIdByL2BeatProjectId,
					ethereumChainId,
					l2BeatProjectChainIds,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				const summary = await fetchScalingSummary()
				return [
					{
						[EntityMetaKey.Selector]: {
							...{ caip2: { namespace: 'eip155' as const, reference: String(ethereumChainId) } },
						},
					},
					...l2BeatProjectChainIds
						.flatMap(({ projectId }) => {
							const chainId = chainIdByL2BeatProjectId[projectId]
							return (
								chainId == null ?
									[]
								:
									[
										{
											[EntityMetaKey.Selector]: {
												...{ caip2: { namespace: 'eip155' as const, reference: String(chainId) } },
											},
										},
									]
							)
						}),
				]
			}
			}
		})({
			$$evmNetworks: (snapshot) => snapshot,
		}),

		defineResolver(Source.L2Beat_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }) => {
				const {
					l2beatHostChainToParentChainId,
					l2BeatProjectIdByChainId,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				const projectId = l2BeatProjectIdByChainId[caip2.reference]
				if (projectId == null) return undefined
				const summary = await fetchScalingSummary()
				const project = summary.projects[projectId]
				if (project == null || project.isArchived === true) return undefined
				const parentChainId = l2beatHostChainToParentChainId[project.hostChain]
				if (parentChainId === Number(caip2.reference)) return undefined
				return {
					[EntityMetaKey.Selector]: {
						...{ caip2: { namespace: 'eip155' as const, reference: String(parentChainId) } },
					},
				}
			}
			}
		})({
				Evm: {
					$parent: (snapshot) => snapshot
				},
			}),

		defineResolver(Source.L2Beat_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async (entitySelector) => {
				const {
					l2BeatProjectIdByChainId,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				const projectId = l2BeatProjectIdByChainId[entitySelector.caip2.reference]
				if (projectId == null) return undefined
				const summary = await fetchScalingSummary()
				const project = summary.projects[projectId]
				if (project == null || project.isArchived === true) return undefined
				return {
					[EntityMetaKey.Selector]: {
						$network: entitySelector,
						projectId,
					},
				}
			}
			}
		})({
				Evm: {
					$rollup: (snapshot) => snapshot
				},
			}),

		defineResolver(Source.L2Beat_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }) => {
				const {
					chainIdByL2BeatProjectId,
					l2beatHostChainToParentChainId,
					l2BeatProjectChainIds,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				const parentChainId = Number(caip2.reference)
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
				const summary = await fetchScalingSummary()
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
								[EntityMetaKey.Selector]: {
									$network: {
										...{ caip2: { namespace: 'eip155' as const, reference: String(chainId) } },
									},
									projectId,
								},
							},
						]
					})
				)
			}
			}
		})({
				Evm: {
					$$settledRollups: (snapshot) => snapshot
				},
			}),

		defineResolver(Source.L2Beat_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }) => {
				const {
					chainIdByL2BeatProjectId,
					l2beatHostChainToParentChainId,
					l2BeatProjectChainIds,
				} = await import('$/sources/L2Beat/Rest/constants.ts')
				const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
				const parentChainId = Number(caip2.reference)
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
				const summary = await fetchScalingSummary()
				return (
					l2BeatProjectChainIds.flatMap(({ projectId }) => {
						const chainId = chainIdByL2BeatProjectId[projectId]
						const project = summary.projects[projectId]
						if (
							chainId == null
							|| chainId === parentChainId
							|| project == null
							|| project.isArchived === true
							|| !hostLabels.includes(project.hostChain)
						) return []
						return [
							{
								[EntityMetaKey.Selector]: {
									...{ caip2: { namespace: 'eip155' as const, reference: String(chainId) } },
								},
							},
						]
					})
				)
			}
			}
		})({
				Evm: {
					$$childLayers: (snapshot) => snapshot
				},
			}),
	],
}
