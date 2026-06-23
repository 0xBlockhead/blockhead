import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AcpPromptTurnSelector {
	SessionTurnId = '$session+turnId',
}
export default {
	entityType: EntityType.AcpPromptTurn,
	label: 'acp prompt turn',
	labelPlural: 'acp prompt turns',
	selectors: [
		{
			name: AcpPromptTurnSelector.SessionTurnId,
			fields: [
				'$session',
				'turnId',
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
			name: 'turnId',
			label: 'turn ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'startedAt',
			label: 'started AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'completedAt',
			label: 'completed AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'cancelledAt',
			label: 'cancelled AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'stopReason',
			label: 'stop reason',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'userPromptHashAlgorithm',
			label: 'user prompt hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'userPromptHash',
			label: 'user prompt hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$messages',
			label: 'messages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AcpMessage,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$toolCalls',
			label: 'tool calls',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AcpToolCall,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$fileOperations',
			label: 'file operations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AcpFileOperation,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$permissionRequests',
			label: 'permission requests',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AcpPermissionRequest,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
