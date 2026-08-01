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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	epoch: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$epoch: {
		entityType: EntityType.BeaconEpoch,
		cardinality: EntityFieldCardinality.One,
	},
	proposerIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	root: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stateRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bodyRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	canonical: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$beaconCommittees: {
		entityType: EntityType.BeaconCommittee,
		cardinality: EntityFieldCardinality.Many,
	},
	$$beaconAttestations: {
		entityType: EntityType.BeaconAttestation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$beaconWithdrawals: {
		entityType: EntityType.BeaconWithdrawal,
		cardinality: EntityFieldCardinality.Many,
	},
	$$beaconSlashings: {
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
