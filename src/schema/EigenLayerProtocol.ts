// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EigenLayerProtocolSelector {
	Network = 'Network',
}
export const EigenLayerProtocol = entity({
	entityType: EntityType.EigenLayerProtocol,
	labels: {
		singular: 'eigen layer protocol',
		plural: 'eigen layer protocols',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'protocol name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$delegationManager: {
		label: 'delegation manager',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$strategyManager: {
		label: 'strategy manager',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$avsDirectory: {
		label: 'AVS directory',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$allocationManager: {
		label: 'allocation manager',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$rewardsCoordinator: {
		label: 'rewards coordinator',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$slasher: {
		label: 'slasher',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$operators: {
		label: 'operators',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EigenLayerOperator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$avss: {
		label: 'AVSs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EigenLayerAvs,
		cardinality: EntityFieldCardinality.Many,
	},
	$$strategies: {
		label: 'strategies',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EigenLayerStrategy,
		cardinality: EntityFieldCardinality.Many,
	},
	$$rewards: {
		label: 'rewards',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EigenLayerReward_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$slashingEvents: {
		label: 'slashing events',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EigenLayerSlashingEvent,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
