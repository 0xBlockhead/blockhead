// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosBakingRight,
	labels: {
		singular: 'tezos baking right',
		plural: 'tezos baking rights',
	},
})({
	$network: {
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	cycle: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	level: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	rightKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	bakerAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$baker: {
		entityType: EntityType.TezosBaker,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	round: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slots: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	priority: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.TezosBakingRight_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkCycleLevelRightKindBakerAddressSource: [
			'$network',
			'cycle',
			'level',
			'rightKind',
			'bakerAddress',
			'source',
		],
	},
})
