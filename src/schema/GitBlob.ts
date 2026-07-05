// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum GitBlobSelector {
	ObjectIdObjectFormat = 'ObjectIdObjectFormat',
}
export default {
	entityType: EntityType.GitBlob,
	label: 'Git blob',
	labelPlural: 'Git blobs',
	selectors: [
		{
			name: GitBlobSelector.ObjectIdObjectFormat,
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
				name: 'mime',
				label: 'mime',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'byteSize',
				label: 'byte size',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'textSample',
				label: 'text sample',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$paths',
				label: 'paths',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.GitTreeEntry,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
