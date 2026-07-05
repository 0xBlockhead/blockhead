// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum GitTagSelector {
	ObjectIdObjectFormat = 'ObjectIdObjectFormat',
}
export default {
	entityType: EntityType.GitTag,
	label: 'Git tag',
	labelPlural: 'Git tags',
	selectors: [
		{
			name: GitTagSelector.ObjectIdObjectFormat,
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
				name: 'targetObjectId',
				label: 'target object ID',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'targetKind',
				label: 'target kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'tagName',
				label: 'tag name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'taggerSelector',
				label: 'tagger selector',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'taggerTimestampMs',
				label: 'tagger timestamp ms',
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
