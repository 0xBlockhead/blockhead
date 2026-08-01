// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.McpPromptResult,
	labels: {
		singular: 'mcp prompt result',
		plural: 'mcp prompt results',
	},
})({
	$prompt: {
		label: 'prompt',
		entityType: EntityType.McpPrompt,
		cardinality: EntityFieldCardinality.One,
	},
	argumentsHashAlgorithm: {
		label: 'arguments hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	argumentsHash: {
		label: 'arguments hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messages: {
		label: 'messages',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	raw: {
		label: 'raw',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
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
