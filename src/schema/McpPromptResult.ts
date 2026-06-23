import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum McpPromptResultSelector {
	PromptArgumentsHashAlgorithmArgumentsHashTimestampMsSource = '$prompt+argumentsHashAlgorithm+argumentsHash+timestampMs+source',
}
export default {
	entityType: EntityType.McpPromptResult,
	label: 'mcp prompt result',
	labelPlural: 'mcp prompt results',
	selectors: [
		{
			name: McpPromptResultSelector.PromptArgumentsHashAlgorithmArgumentsHashTimestampMsSource,
			fields: [
				'$prompt',
				'argumentsHashAlgorithm',
				'argumentsHash',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$prompt',
			label: 'prompt',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.McpPrompt,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'argumentsHashAlgorithm',
			label: 'arguments hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'argumentsHash',
			label: 'arguments hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'description',
			label: 'Description',
			description: 'A human-readable description from the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'messages',
			label: 'messages',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'raw',
			label: 'raw',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'error',
			label: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
