// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BeaconEpochSelector {
	EvmNetworkEpoch = 'EvmNetworkEpoch',
}
export const BeaconEpoch = entity({
	entityType: EntityType.BeaconEpoch,
	labels: {
		singular: 'beacon epoch',
		plural: 'Beacon epochs',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	epoch: {
		label: 'Epoch',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	startSlot: {
		label: 'Start slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	endSlot: {
		label: 'End slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	slotCount: {
		label: 'Slot count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$beaconSlots: {
		label: 'Beacon slots',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BeaconSlot,
		cardinality: EntityFieldCardinality.Many,
	},
	finalized: {
		label: 'Finalized',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	globalParticipationRate: {
		label: 'Global participation rate',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validatorsCount: {
		label: 'Validators',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	attestationsCount: {
		label: 'Attestations',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	attesterSlashingsCount: {
		label: 'Attester slashings',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proposerSlashingsCount: {
		label: 'Proposer slashings',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	withdrawalsCount: {
		label: 'Withdrawals',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EvmNetworkEpoch: [
			'$network',
			'epoch',
		],
	},
})
