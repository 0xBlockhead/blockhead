import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import {
	NetworkEnvironment,
	NetworkExecutionModel,
	NetworkLedgerModel,
	NetworkNamespace,
} from '$/constants/Network.ts'
import { NetworkStackId } from '$/constants/NetworkStack.ts'
import NetworkSchema from '$/schema/Network.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import {
	chainIdByL2BeatProjectId,
	ethereumChainId,
	l2beatHostChainToParentChainId,
	l2BeatProjectChainIds,
	l2BeatProjectIdByChainId,
} from '$/sources/L2Beat/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'
import { type as arktype } from 'arktype'

export default {
	source: Source.L2Beat_Rest,

	resolvers: [
		defineResolver(Source.L2Beat_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: [
						{
							caip2: {
								namespace: 'eip155',
								reference: String(l2BeatProjectChainIds[0].chainId),
							},
						},
						...l2BeatProjectChainIds.slice(1).map(({ chainId }) => ({
							caip2: {
								namespace: 'eip155' as const,
								reference: String(chainId),
							},
						})),
					],
					resolve: async (entitySelector) => {
						const project = (
							await (
								await import('$/sources/L2Beat/Rest/queries.ts')
							).fetchScalingSummary()
						).projects[l2BeatProjectIdByChainId[entitySelector.caip2.reference]]
						if (project == null)
							throw new Error('L2Beat_Rest: network project not found')

						const slugField = NetworkSchema.fields.find((field) => (
							field.type === EntityFieldType.Primitive
							&& field.name === 'slug'
						))
						if (slugField == null)
							throw new Error('L2Beat_Rest: Network.slug schema field not found')

						const slug = slugField.primitiveType(project.slug)
						if (slug instanceof arktype.errors)
							throw new Error(`L2Beat_Rest: invalid network slug: ${slug.summary}`)

						return {
							slug,
							name: project.name,
							namespace: NetworkNamespace.Evm,
							ledgerModels: [NetworkLedgerModel.Account],
							executionModels: [NetworkExecutionModel.Evm],
							$networkStack: {
								[EntityMetaKey.Selector]: {
									networkStackId: NetworkStackId.Ethereum,
								},
							},
							environment: NetworkEnvironment.Mainnet,
						}
					},
				},
			},
		})({
			slug: (network) => network.slug,
			name: (network) => network.name,
			namespace: (network) => network.namespace,
			ledgerModels: (network) => network.ledgerModels,
			executionModels: (network) => network.executionModels,
			$networkStack: (network) => network.$networkStack,
			environment: (network) => network.environment,
		}),

		defineResolver(Source.L2Beat_Rest, {
			entityType: EntityType.EvmRollup,
			resolve: {
				EvmNetworkProjectId: {
					resolve: async ({ projectId }) => {
						const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
						const project = (await fetchScalingSummary()).projects[projectId]
						if (project == null)
							throw new Error('L2Beat_Rest: rollup project not found')

						return {
							name: project.name,
							slug: project.slug,
							type: project.type,
							...(project.category != null && {
								category: project.category,
							}),
							hostChain: project.hostChain,
							$settlementNetwork: {
								[EntityMetaKey.Selector]: {
									caip2: {
										namespace: 'eip155' as const,
										reference: String(l2beatHostChainToParentChainId[project.hostChain]),
									},
								},
							},
						}
					},
				},
			},
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
				Scope: {
					resolve: async () => {
						return [
							{
								[EntityMetaKey.Selector]: {
									caip2: {
										namespace: 'eip155' as const,
										reference: String(ethereumChainId),
									},
								},
							},
							...l2BeatProjectChainIds.flatMap(({ projectId }) => (
								chainIdByL2BeatProjectId[projectId] == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											caip2: {
												namespace: 'eip155' as const,
												reference: String(chainIdByL2BeatProjectId[projectId]),
											},
										},
									}]
							)),
						]
					},
				},
			},
		})({
			$$evmNetworks: (snapshot) => snapshot,
		}),

		defineResolver(Source.L2Beat_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector) => {
						const chainId = Number(entitySelector.caip2.reference)
						const projectId = l2BeatProjectIdByChainId[entitySelector.caip2.reference]
						const hostLabels = Object.entries(l2beatHostChainToParentChainId)
							.flatMap(([label, parentChainId]) => parentChainId === chainId ? [label] : [])
						if (projectId == null && hostLabels.length === 0)
							return {
								parent: undefined,
								rollup: undefined,
								settledRollups: [],
								childLayers: [],
							}

						const summary = await (
							await import('$/sources/L2Beat/Rest/queries.ts')
						).fetchScalingSummary()
						const project = projectId == null ? undefined : summary.projects[projectId]
						return {
							parent: (
								project == null
								|| project.isArchived === true
								|| l2beatHostChainToParentChainId[project.hostChain] === chainId
							) ?
								undefined
							:
								{
									[EntityMetaKey.Selector]: {
										caip2: {
											namespace: 'eip155' as const,
											reference: String(l2beatHostChainToParentChainId[project.hostChain]),
										},
									},
								},
							rollup: project == null || project.isArchived === true ?
								undefined
							:
								{
									[EntityMetaKey.Selector]: {
										$network: entitySelector,
										projectId,
									},
								},
							settledRollups: l2BeatProjectChainIds.flatMap(({ projectId: childProjectId }) => {
								const childChainId = chainIdByL2BeatProjectId[childProjectId]
								const childProject = summary.projects[childProjectId]
								return (
									childChainId == null
									|| childProject == null
									|| childProject.isArchived === true
									|| !hostLabels.includes(childProject.hostChain)
								) ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											$network: {
												caip2: {
													namespace: 'eip155',
													reference: String(childChainId),
												},
											},
											projectId: childProjectId,
										},
									}]
							}),
							childLayers: l2BeatProjectChainIds.flatMap(({ projectId: childProjectId }) => {
								const childChainId = chainIdByL2BeatProjectId[childProjectId]
								const childProject = summary.projects[childProjectId]
								return (
									childChainId == null
									|| childChainId === chainId
									|| childProject == null
									|| childProject.isArchived === true
									|| !hostLabels.includes(childProject.hostChain)
								) ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											caip2: {
												namespace: 'eip155' as const,
												reference: String(childChainId),
											},
										},
									}]
							}),
						}
					},
				},
			},
		})({
			Evm: {
				$parent: (snapshot) => snapshot.parent,
				$rollup: (snapshot) => snapshot.rollup,
				$$settledRollups: (snapshot) => snapshot.settledRollups,
				$$childLayers: (snapshot) => snapshot.childLayers,
			},
		}),
	],
} as const
