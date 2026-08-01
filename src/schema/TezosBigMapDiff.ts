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
		label: 'operation',
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.One,
	},
	bigMapId: {
		label: 'big map ID',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	keyHash: {
		label: 'key hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	action: {
		label: 'action',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	key: {
		label: 'key',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$bigMap: {
		label: 'big map',
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
