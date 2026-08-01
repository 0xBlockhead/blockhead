// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.GitTree,
		cardinality: EntityFieldCardinality.One,
	},
	path: {
		label: 'path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	mode: {
		label: 'mode',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectId: {
		label: 'object ID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	objectKind: {
		label: 'object kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$object: {
		label: 'object',
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
