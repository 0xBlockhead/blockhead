// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EigenLayerProtocol,
	labels: {
		singular: 'eigen layer protocol',
		plural: 'eigen layer protocols',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'protocol name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$delegationManager: {
		label: 'delegation manager',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$strategyManager: {
		label: 'strategy manager',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$avsDirectory: {
		label: 'AVS directory',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$allocationManager: {
		label: 'allocation manager',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$rewardsCoordinator: {
		label: 'rewards coordinator',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$slasher: {
		label: 'slasher',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$operators: {
		label: 'operators',
		entityType: EntityType.EigenLayerOperator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$avss: {
		label: 'AVSs',
		entityType: EntityType.EigenLayerAvs,
		cardinality: EntityFieldCardinality.Many,
	},
	$$strategies: {
		label: 'strategies',
		entityType: EntityType.EigenLayerStrategy,
		cardinality: EntityFieldCardinality.Many,
	},
	$$rewards: {
		label: 'rewards',
		entityType: EntityType.EigenLayerReward_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$slashingEvents: {
		label: 'slashing events',
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
