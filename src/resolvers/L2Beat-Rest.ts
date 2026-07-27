import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import {
	NetworkEnvironment,
	NetworkExecutionModel,
	NetworkLedgerModel,
	NetworkNamespace,
} from '$/constants/Network.ts'
import { NetworkStackId } from '$/constants/NetworkStack.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { l2BeatProjectIdByChainId } from '$/sources/L2Beat/Rest/constants.ts'
import type { L2BeatScalingSummaryProject } from '$/sources/L2Beat/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const evmRollupReference = (
	$network: {
		caip2: {
			namespace: 'eip155'
			reference: string
		}
	},
	projectId: string,
	project: L2BeatScalingSummaryProject,
	settlementChainId: number
) => ({
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
		[entityFieldAddressKey(EntityType.EvmRollup, [], '$settlementNetwork')]: {
			[EntityMetaKey.Selector]: {
				caip2: {
					namespace: 'eip155' as const,
					reference: String(settlementChainId),
				},
			},
		},
	},
})

export default {
	source: Source.L2Beat_Rest,

	resolvers: [
		defineResolver(Source.L2Beat_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: Object.keys(l2BeatProjectIdByChainId).map((reference) => ({
						caip2: {
							namespace: 'eip155',
							reference,
						},
					})),
					resolve: async (entitySelector) => {
						const project = (
							await (
								await import('$/sources/L2Beat/Rest/queries.ts')
							).fetchScalingSummary()
						).projects[l2BeatProjectIdByChainId[entitySelector.caip2.reference]]
						if (project == null)
							throw new Error('L2Beat_Rest: network project not found')

						return {
							slug: project.slug,
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
					resolve: async ({ $network, projectId }) => {
						const {
							l2beatHostChainToParentChainId,
						} = await import('$/sources/L2Beat/Rest/constants.ts')
						const { fetchScalingSummary } = await import('$/sources/L2Beat/Rest/queries.ts')
						const project = (await fetchScalingSummary()).projects[projectId]
						if (project == null)
							throw new Error('L2Beat_Rest: rollup project not found')

						return evmRollupReference(
							$network,
							projectId,
							project,
							l2beatHostChainToParentChainId[project.hostChain]
						)
					},
				},
			},
		})({
			name: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmRollup, [], 'name')],
			slug: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmRollup, [], 'slug')],
			type: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmRollup, [], 'type')],
			category: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmRollup, [], 'category')],
			hostChain: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmRollup, [], 'hostChain')],
			$settlementNetwork: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmRollup, [], '$settlementNetwork')],
		}),

		defineResolver(Source.L2Beat_Rest, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => {
						const {
							chainIdByL2BeatProjectId,
							ethereumChainId,
							l2BeatProjectChainIds,
						} = await import('$/sources/L2Beat/Rest/constants.ts')
						await (await import('$/sources/L2Beat/Rest/queries.ts')).fetchScalingSummary()
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
						const {
							chainIdByL2BeatProjectId,
							l2beatHostChainToParentChainId,
							l2BeatProjectIdByChainId,
							l2BeatProjectChainIds,
						} = await import('$/sources/L2Beat/Rest/constants.ts')
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
								evmRollupReference(
									entitySelector,
									projectId,
									project,
									l2beatHostChainToParentChainId[project.hostChain]
								),
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
									[evmRollupReference(
										{
											caip2: {
												namespace: 'eip155',
												reference: String(childChainId),
											},
										},
										childProjectId,
										childProject,
										l2beatHostChainToParentChainId[childProject.hostChain]
									)]
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
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.Network, [], 'slug')]: childProject.slug,
											[entityFieldAddressKey(EntityType.Network, [], 'name')]: childProject.name,
											[entityFieldAddressKey(EntityType.Network, [], 'namespace')]: NetworkNamespace.Evm,
											[entityFieldAddressKey(EntityType.Network, [], 'ledgerModels')]: [NetworkLedgerModel.Account],
											[entityFieldAddressKey(EntityType.Network, [], 'executionModels')]: [NetworkExecutionModel.Evm],
											[entityFieldAddressKey(EntityType.Network, [], '$networkStack')]: {
												[EntityMetaKey.Selector]: {
													networkStackId: NetworkStackId.Ethereum,
												},
											},
											[entityFieldAddressKey(EntityType.Network, [], 'environment')]: NetworkEnvironment.Mainnet,
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
}
