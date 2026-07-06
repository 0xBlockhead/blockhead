// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum AcpToolCallSelector {
	PromptTurnToolCallId = 'PromptTurnToolCallId',
}
export default {
	entityType: EntityType.AcpToolCall,
	label: 'acp tool call',
	labelPlural: 'acp tool calls',
	selectors: [
		{
			name: AcpToolCallSelector.PromptTurnToolCallId,
			fields: [
				'$promptTurn',
				'toolCallId',
			],
		},
	],
	fields: [
		{
			name: '$promptTurn',
			label: 'prompt turn',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AcpPromptTurn,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toolCallId',
			label: 'tool call ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toolName',
			label: 'tool name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'serverName',
			label: 'server name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'startedAt',
			label: 'started AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'completedAt',
			label: 'completed AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'inputHashAlgorithm',
			label: 'input hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'inputHash',
			label: 'input hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'outputHashAlgorithm',
			label: 'output hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'outputHash',
			label: 'output hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AcpToolCall_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
