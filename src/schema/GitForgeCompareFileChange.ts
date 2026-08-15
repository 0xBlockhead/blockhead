// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitForgeCompareFileChange,
	labels: {
		singular: 'Git forge compare file change',
		plural: 'Git forge compare file changes',
	},
})({
	$compare: {
		entityType: EntityType.GitForgeCompare,
		cardinality: EntityFieldCardinality.One,
	},
	oldPath: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	newPath: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	oldMode: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	newMode: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	newFile: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	renamedFile: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	deletedFile: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	tooLarge: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	patch: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		CompareOldPathNewPath: [
			'$compare',
			'oldPath',
			'newPath',
		],
	},
})
