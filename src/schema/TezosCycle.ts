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
		label: 'network',
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	cycle: {
		label: 'cycle',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	firstLevel: {
		label: 'first level',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastLevel: {
		label: 'last level',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	snapshotLevel: {
		label: 'snapshot level',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	randomSeed: {
		label: 'random seed',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$bakerTimestamps: {
		label: 'baker timestamps',
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
