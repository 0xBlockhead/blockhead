// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitTreeEntry,
	labels: {
		singular: 'Git tree entry',
		plural: 'Git tree entries',
	},
})({
	$tree: {
		label: 'tree',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.GitTree,
		cardinality: EntityFieldCardinality.One,
	},
	path: {
		label: 'path',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	mode: {
		label: 'mode',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectId: {
		label: 'object ID',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	objectKind: {
		label: 'object kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$object: {
		label: 'object',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.GitObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TreePath: [
			'$tree',
			'path',
		],
	},
})
