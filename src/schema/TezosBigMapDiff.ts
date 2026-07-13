// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosBigMapDiffSelector {
	OperationBigMapIdKeyHash = 'OperationBigMapIdKeyHash',
}
export const TezosBigMapDiff = entity({
	entityType: EntityType.TezosBigMapDiff,
	labels: {
		singular: 'tezos big map diff',
		plural: 'tezos big map diffs',
	},
})({
	$operation: {
		label: 'operation',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.One,
	},
	bigMapId: {
		label: 'big map ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	keyHash: {
		label: 'key hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	action: {
		label: 'action',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	key: {
		label: 'key',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$bigMap: {
		label: 'big map',
		type: EntityFieldType.EntityReference,
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
