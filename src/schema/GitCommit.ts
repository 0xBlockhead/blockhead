// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum GitCommitSelector {
	ObjectIdObjectFormat = 'ObjectIdObjectFormat',
}
export default {
	entityType: EntityType.GitCommit,
	label: 'Git commit',
	labelPlural: 'Git commits',
	selectors: [
		{
			name: GitCommitSelector.ObjectIdObjectFormat,
			fields: [
				'objectId',
				'objectFormat',
			],
		},
	],
	fields: [
		{
				name: 'objectId',
				label: 'object ID',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'objectFormat',
				label: 'object format',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$object',
				label: 'object',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.GitObject,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'treeObjectId',
				label: 'tree object ID',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'parentObjectIds',
				label: 'parent object ids',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'authorName',
				label: 'author name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'authorEmail',
				label: 'author email',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'authorTimestampMs',
				label: 'author timestamp ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'committerName',
				label: 'committer name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'committerEmail',
				label: 'committer email',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'committerTimestampMs',
				label: 'committer timestamp ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'message',
				label: 'message',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$signatures',
				label: 'signatures',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.GitSignature,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
