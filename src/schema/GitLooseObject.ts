// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum GitLooseObjectSelector {
	ObjectIdObjectFormatByteSource = 'ObjectIdObjectFormatByteSource',
}
export default {
	entityType: EntityType.GitLooseObject,
	label: 'Git loose object',
	labelPlural: 'Git loose objects',
	selectors: [
		{
			name: GitLooseObjectSelector.ObjectIdObjectFormatByteSource,
			fields: [
				'objectId',
				'objectFormat',
				'byteSource',
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
			name: 'byteSource',
			label: 'byte source',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'path',
			label: 'path',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'compressedSizeBytes',
			label: 'compressed size bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'observedAtMs',
			label: 'observed AT ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$object',
			label: 'object',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.GitObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
