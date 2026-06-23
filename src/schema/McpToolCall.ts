import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum McpToolCallSelector {
	ServerCallId = '$server+callId',
}
export default {
	entityType: EntityType.McpToolCall,
	label: 'mcp tool call',
	labelPlural: 'mcp tool calls',
	selectors: [
		{
			name: McpToolCallSelector.ServerCallId,
			fields: [
				'$server',
				'callId',
			],
		},
	],
	fields: [
		{
			name: '$server',
			label: 'server',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.McpServer,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'callId',
			label: 'call ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$tool',
			label: 'tool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.McpTool,
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
			name: 'inputHashAlgorithm',
			label: 'input hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'inputHash',
			label: 'input hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'outputHashAlgorithm',
			label: 'output hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'outputHash',
			label: 'output hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.McpToolCall_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
