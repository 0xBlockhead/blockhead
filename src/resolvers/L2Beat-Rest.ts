import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
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
	ethereumChainId,
	l2BeatChainIdByProjectId,
	l2BeatHostChainByLabel,
	l2BeatHostChains,
	l2BeatProjectChainIds,
	l2BeatProjectIdByChainId,
	scalingSummarySyncedUntilMs,
} from '$/sources/L2Beat/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'
import type { L2BeatScalingSummaryProject } from '$/sources/L2Beat/Rest/types.ts'
import { type as arktype } from 'arktype'

const l2BeatRollupTimestampRef = ({
	$network,
	projectId,
	timestampMs,
	project,
}: {
	$network: {
		caip2: {
			namespace: 'eip155'
			reference: string
		}
	} | {
		slug: string
	}
	projectId: string
	timestampMs: number
	project: L2BeatScalingSummaryProject
}) => ({
	[EntityMetaKey.Selector]: {
		$rollup: {
			$network,
			projectId,
		},
		timestampMs,
		source: Source.L2Beat_Rest,
	},
	[EntityMetaKey.Fields]: {
		...(project.isArchived != null && {
			[entityFieldAddressKey(EntityType.EvmRollup_Timestamp, [], 'isArchived')]: project.isArchived,
		}),
		...(project.isUpcoming != null && {
			[entityFieldAddressKey(EntityType.EvmRollup_Timestamp, [], 'isUpcoming')]: project.isUpcoming,
		}),
		...(project.isUnderReview != null && {
			[entityFieldAddressKey(EntityType.EvmRollup_Timestamp, [], 'isUnderReview')]: project.isUnderReview,
		}),
		...(project.stage != null && {
			[entityFieldAddressKey(EntityType.EvmRollup_Timestamp, [], 'listingStage')]: project.stage,
		}),
		[entityFieldAddressKey(EntityType.EvmRollup_Timestamp, [], 'sourceUpdatedAt')]: timestampMs,
	},
})

const l2BeatRollupListRef = ({
	$network,
	projectId,
	project,
}: {
	$network: {
		caip2: {
			namespace: 'eip155'
			reference: string
		}
	}
	projectId: string
	project: L2BeatScalingSummaryProject
}) => ({
	[EntityMetaKey.Selector]: {
		$network,
		projectId,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.EvmRollup, [], 'name')]: project.name,
		[entityFieldAddressKey(EntityType.EvmRollup, [], 'slug')]: project.slug,
		[entityFieldAddressKey(EntityType.EvmRollup, [], 'type')]: project.type,
		...(project.category != null && {
			[entityFieldAddressKey(EntityType.EvmRollup, [], 'category')]: project.category,
		}),
		[entityFieldAddressKey(EntityType.EvmRollup, [], 'hostChain')]: project.hostChain,
	},
})

const l2BeatChildNetworkListRef = ({
	chainId,
	project,
}: {
	chainId: number
	project: L2BeatScalingSummaryProject
}) => ({
	[EntityMetaKey.Selector]: {
		caip2: {
			namespace: 'eip155' as const,
			reference: String(chainId),
		},
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.Network, [], 'name')]: project.name,
		[entityFieldAddressKey(EntityType.Network, [], 'slug')]: project.slug,
	},
})


export default {
	source: Source.L2Beat_Rest,

	resolvers: [
		defineResolver({
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
						const projectId = l2BeatProjectIdByChainId.get(entitySelector.caip2.reference)
						const project = (
							await (
								await import('$/sources/L2Beat/Rest/queries.ts')
							).fetchScalingSummary()
						).projects[projectId ?? '']
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

		defineResolver({
			entityType: EntityType.EvmRollup,
			resolve: {
				EvmNetworkProjectId: {
					resolve: async ({ $network, projectId }) => {
						const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
						const summary = await fetchScalingSummary()
						const project = summary.projects[projectId]
						if (project == null)
							throw new Error('L2Beat_Rest: rollup project not found')
						const hostChain = l2BeatHostChainByLabel.get(project.hostChain)
						if (hostChain == null)
							throw new Error(`L2Beat_Rest: unknown host chain ${project.hostChain}`)

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
										reference: String(hostChain.parentChainId),
									},
								},
							},
							$$timestamps: [
								l2BeatRollupTimestampRef({
									$network,
									projectId,
									timestampMs: scalingSummarySyncedUntilMs(summary.chart.syncedUntil),
									project,
								}),
							],
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
			$$timestamps: {
				select: (snapshot) => snapshot.$$timestamps,
				resolveCount: (snapshot) => snapshot.$$timestamps.length,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmRollup_Timestamp,
			resolve: {
				RollupTimestampMsSource: {
					resolve: async ({ $rollup, timestampMs, source }) => {
						if (source !== Source.L2Beat_Rest)
							throw new Error(`L2Beat_Rest: unsupported rollup observation source ${source}`)

						const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
						const summary = await fetchScalingSummary()
						const project = summary.projects[$rollup.projectId]
						if (project == null)
							throw new Error('L2Beat_Rest: rollup project not found')

						const observationMs = scalingSummarySyncedUntilMs(summary.chart.syncedUntil)
						if (timestampMs !== observationMs)
							throw new Error('L2Beat_Rest: rollup observation clock mismatch')

						return {
							...(project.isArchived != null && {
								isArchived: project.isArchived,
							}),
							...(project.isUpcoming != null && {
								isUpcoming: project.isUpcoming,
							}),
							...(project.isUnderReview != null && {
								isUnderReview: project.isUnderReview,
							}),
							...(project.stage != null && {
								listingStage: project.stage,
							}),
							sourceUpdatedAt: observationMs,
						}
					},
				},
			},
		})({
			isArchived: (snapshot) => snapshot.isArchived,
			isUpcoming: (snapshot) => snapshot.isUpcoming,
			isUnderReview: (snapshot) => snapshot.isUnderReview,
			listingStage: (snapshot) => snapshot.listingStage,
			sourceUpdatedAt: (snapshot) => snapshot.sourceUpdatedAt,
		}),

		defineResolver({
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
							...l2BeatProjectChainIds.map(({ chainId }) => ({
								[EntityMetaKey.Selector]: {
									caip2: {
										namespace: 'eip155' as const,
										reference: String(chainId),
									},
								},
							})),
						]
					},
				},
			},
		})({
			$$evmNetworks: (snapshot) => snapshot,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector) => {
						const chainId = Number(entitySelector.caip2.reference)
						const projectId = l2BeatProjectIdByChainId.get(entitySelector.caip2.reference)
						const hostLabels = l2BeatHostChains
							.flatMap(({ label, parentChainId }) => parentChainId === chainId ? [label] : [])
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
						const parentChainId = project == null ? undefined : l2BeatHostChainByLabel.get(project.hostChain)?.parentChainId
						return {
							parent: (
								project == null
								|| project.isArchived === true
								|| parentChainId == null
								|| parentChainId === chainId
							) ?
								undefined
							:
								{
									[EntityMetaKey.Selector]: {
										caip2: {
											namespace: 'eip155' as const,
											reference: String(parentChainId),
										},
									},
								},
							rollup: project == null || project.isArchived === true ?
								undefined
							:
								l2BeatRollupListRef({
									$network: entitySelector,
									projectId,
									project,
								}),
							settledRollups: Object.entries(summary.projects).flatMap(([
								childProjectId,
								childProject,
							]) => (
								(
									childProject.isArchived === true
									|| !hostLabels.includes(childProject.hostChain)
								) ?
									[]
								:
									[l2BeatRollupListRef({
										$network: {
											caip2: {
												namespace: 'eip155' as const,
												reference: String(
													l2BeatChainIdByProjectId.get(childProjectId)
													?? chainId
												),
											},
										},
										projectId: childProjectId,
										project: childProject,
									})]
							)),
							childLayers: l2BeatProjectChainIds.flatMap(({
								projectId: childProjectId,
								chainId: childChainId,
							}) => {
								const childProject = summary.projects[childProjectId]
								return (
									childChainId === chainId
									|| childProject == null
									|| childProject.isArchived === true
									|| !hostLabels.includes(childProject.hostChain)
								) ?
									[]
								:
									[l2BeatChildNetworkListRef({
										chainId: childChainId,
										project: childProject,
									})]
							}),
						}
					},
				},
			},
		})({
			Evm: {
				$parent: (snapshot) => snapshot.parent,
				$rollup: (snapshot) => snapshot.rollup,
				$$settledRollups: {
					select: (snapshot) => snapshot.settledRollups,
					resolveCount: (snapshot) => snapshot.settledRollups.length,
				},
				$$childLayers: {
					select: (snapshot) => snapshot.childLayers,
					resolveCount: (snapshot) => snapshot.childLayers.length,
				},
			},
		}),
	],
} as const satisfies RegisteredSourceResolverModule
