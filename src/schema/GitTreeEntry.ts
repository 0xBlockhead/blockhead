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
		entityType: EntityType.GitTree,
		cardinality: EntityFieldCardinality.One,
	},
	path: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	mode: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectId: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	objectKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$object: {
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
