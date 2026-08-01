// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconEpoch,
	labels: {
		singular: 'beacon epoch',
		plural: 'Beacon epochs',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	epoch: {
		label: 'Epoch',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	startSlot: {
		label: 'Start slot',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	endSlot: {
		label: 'End slot',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	slotCount: {
		label: 'Slot count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$beaconSlots: {
		label: 'Beacon slots',
		entityType: EntityType.BeaconSlot,
		cardinality: EntityFieldCardinality.Many,
	},
	finalized: {
		label: 'Finalized',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	globalParticipationRate: {
		label: 'Global participation rate',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validatorsCount: {
		label: 'Validators',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	attestationsCount: {
		label: 'Attestations',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	attesterSlashingsCount: {
		label: 'Attester slashings',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proposerSlashingsCount: {
		label: 'Proposer slashings',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	withdrawalsCount: {
		label: 'Withdrawals',
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
