// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosBigMapDiff,
	labels: {
		singular: 'tezos big map diff',
		plural: 'tezos big map diffs',
	},
})({
	$operation: {
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.One,
	},
	bigMapId: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	keyHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	action: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	key: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$bigMap: {
		entityType: EntityType.TezosBigMap,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		OperationBigMapIdKeyHash: [
			'$operation',
			'bigMapId',
			'keyHash',
		],
	},
})
