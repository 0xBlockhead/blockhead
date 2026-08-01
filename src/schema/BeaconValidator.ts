// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconValidator,
	labels: {
		singular: 'beacon validator',
		plural: 'Beacon validators',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	indexInNetwork: {
		label: 'Index in network',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	pubkey: {
		label: 'Public key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	balanceGwei: {
		label: 'Balance',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	effectiveBalanceGwei: {
		label: 'Effective balance',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'Status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashed: {
		label: 'Slashed',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		entityType: EntityType.BeaconValidator_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkIndexInNetwork: [
			'$network',
			'indexInNetwork',
		],
		NetworkPubkey: [
			'$network',
			'pubkey',
		],
	},
})
