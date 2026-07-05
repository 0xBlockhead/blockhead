// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum GitTreePathResolutionSelector {
	RepositoryCommitObjectIdPath = 'RepositoryCommitObjectIdPath',
}
export default {
	entityType: EntityType.GitTreePathResolution,
	label: 'Git tree path resolution',
	labelPlural: 'Git tree path resolutions',
	selectors: [
		{
			name: GitTreePathResolutionSelector.RepositoryCommitObjectIdPath,
			fields: [
				'$repository',
				'commitObjectId',
				'path',
			],
		},
	],
	fields: [
		{
				name: '$repository',
				label: 'repository',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.GitRepository,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'commitObjectId',
				label: 'commit object ID',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'path',
				label: 'path',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'treeObjectIds',
				label: 'tree object ids',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'blobObjectId',
				label: 'blob object ID',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'submoduleCommitId',
				label: 'submodule commit ID',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'status',
				label: 'status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
