// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitTreePathResolution,
	labels: {
		singular: 'Git tree path resolution',
		plural: 'Git tree path resolutions',
	},
})({
	$repository: {
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.One,
	},
	commitObjectId: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	path: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	treeObjectIds: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.Many,
	},
	blobObjectId: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$blob: {
		entityType: EntityType.GitBlob,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Gitlab_Rest,
		],
	},
	submoduleCommitId: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
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
