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
		entityType: EntityType.McpPrompt,
		cardinality: EntityFieldCardinality.One,
	},
	argumentsHashAlgorithm: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	argumentsHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messages: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	raw: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
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
