// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosCycle,
	labels: {
		singular: 'tezos cycle',
		plural: 'tezos cycles',
	},
})({
	$network: {
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	cycle: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	firstLevel: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastLevel: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	snapshotLevel: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	randomSeed: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$bakerTimestamps: {
		entityType: EntityType.TezosBaker_Cycle_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkCycle: [
			'$network',
			'cycle',
		],
	},
})
