// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitTreePathResolution,
	labels: {
		singular: 'Git tree path resolution',
		plural: 'Git tree path resolutions',
	},
})({
	$repository: {
		label: 'repository',
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.One,
	},
	commitObjectId: {
		label: 'commit object ID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	path: {
		label: 'path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	treeObjectIds: {
		label: 'tree object ids',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.Many,
	},
	blobObjectId: {
		label: 'blob object ID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	submoduleCommitId: {
		label: 'submodule commit ID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		RepositoryCommitObjectIdPath: [
			'$repository',
			'commitObjectId',
			'path',
		],
	},
})
