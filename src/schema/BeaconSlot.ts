// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconSlot,
	labels: {
		singular: 'beacon slot',
		plural: 'Beacon slots',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		label: 'Slot',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	epoch: {
		label: 'Epoch',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$epoch: {
		label: 'Epoch',
		entityType: EntityType.BeaconEpoch,
		cardinality: EntityFieldCardinality.One,
	},
	proposerIndex: {
		label: 'Proposer index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	root: {
		label: 'Root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentRoot: {
		label: 'Parent root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stateRoot: {
		label: 'State root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bodyRoot: {
		label: 'Body root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	canonical: {
		label: 'Canonical',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		label: 'Signature',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$beaconCommittees: {
		label: 'Beacon committees',
		entityType: EntityType.BeaconCommittee,
		cardinality: EntityFieldCardinality.Many,
	},
	$$beaconAttestations: {
		label: 'Beacon attestations',
		entityType: EntityType.BeaconAttestation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$beaconWithdrawals: {
		label: 'Beacon withdrawals',
		entityType: EntityType.BeaconWithdrawal,
		cardinality: EntityFieldCardinality.Many,
	},
	$$beaconSlashings: {
		label: 'Beacon slashings',
		entityType: EntityType.BeaconSlashing,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmNetworkSlot: [
			'$network',
			'slot',
		],
	},
})
