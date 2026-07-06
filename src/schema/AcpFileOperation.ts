// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum AcpFileOperationSelector {
	SessionOperationId = 'SessionOperationId',
}
export default {
	entityType: EntityType.AcpFileOperation,
	label: 'acp file operation',
	labelPlural: 'acp file operations',
	selectors: [
		{
			name: AcpFileOperationSelector.SessionOperationId,
			fields: [
				'$session',
				'operationId',
			],
		},
	],
	fields: [
		{
			name: '$session',
			label: 'session',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AcpSession,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'operationId',
			label: 'operation ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'operationKind',
			label: 'operation kind',
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
			name: 'startLine',
			label: 'start line',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'endLine',
			label: 'end line',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'contentHashAlgorithm',
			label: 'content hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'contentHash',
			label: 'content hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'error',
			label: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
