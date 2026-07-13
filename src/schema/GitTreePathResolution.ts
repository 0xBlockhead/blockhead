// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum GitTreePathResolutionSelector {
	RepositoryCommitObjectIdPath = 'RepositoryCommitObjectIdPath',
}
export const GitTreePathResolution = entity({
	entityType: EntityType.GitTreePathResolution,
	labels: {
		singular: 'Git tree path resolution',
		plural: 'Git tree path resolutions',
	},
})({
	$repository: {
		label: 'repository',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.One,
	},
	commitObjectId: {
		label: 'commit object ID',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.One,
	},
	path: {
		label: 'path',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	treeObjectIds: {
		label: 'tree object ids',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.Many,
	},
	blobObjectId: {
		label: 'blob object ID',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	submoduleCommitId: {
		label: 'submodule commit ID',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
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
