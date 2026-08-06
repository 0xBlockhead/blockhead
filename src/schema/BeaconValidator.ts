// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconValidator,
	labels: {
		singular: 'beacon validator',
		plural: 'Beacon validators',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	indexInNetwork: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	pubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	balanceGwei: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	effectiveBalanceGwei: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashed: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.BeaconValidator_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	attestationDuties: {
		primitiveType: type({ attesterSlot: 'number.integer >= 0', epoch: 'number.integer >= 0', inclusionSlot: 'number.integer >= 0', status: 'number.integer', 'committeeIndex?': 'number.integer >= 0' }),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.BeaconchaIn_Rest,
		],
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
