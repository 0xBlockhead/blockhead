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
		label: 'network',
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	cycle: {
		label: 'cycle',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	level: {
		label: 'level',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	rightKind: {
		label: 'right kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	bakerAddress: {
		label: 'baker address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$baker: {
		label: 'baker',
		entityType: EntityType.TezosBaker,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	round: {
		label: 'round',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slots: {
		label: 'slots',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	priority: {
		label: 'priority',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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
