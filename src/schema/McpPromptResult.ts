// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum McpPromptResultSelector {
	PromptArgumentsHashAlgorithmArgumentsHashTimestampMsSource = 'PromptArgumentsHashAlgorithmArgumentsHashTimestampMsSource',
}
export const McpPromptResult = entity({
	entityType: EntityType.McpPromptResult,
	labels: {
		singular: 'mcp prompt result',
		plural: 'mcp prompt results',
	},
})({
	$prompt: {
		label: 'prompt',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.McpPrompt,
		cardinality: EntityFieldCardinality.One,
	},
	argumentsHashAlgorithm: {
		label: 'arguments hash algorithm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	argumentsHash: {
		label: 'arguments hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messages: {
		label: 'messages',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	raw: {
		label: 'raw',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		PromptArgumentsHashAlgorithmArgumentsHashTimestampMsSource: [
			'$prompt',
			'argumentsHashAlgorithm',
			'argumentsHash',
			'timestampMs',
			'source',
		],
	},
})
