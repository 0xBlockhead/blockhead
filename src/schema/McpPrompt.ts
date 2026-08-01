// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.McpPrompt,
	labels: {
		singular: 'mcp prompt',
		plural: 'mcp prompts',
	},
})({
	$server: {
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	argumentsSchema: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$results: {
		entityType: EntityType.McpPromptResult,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ServerName: [
			'$server',
			'name',
		],
	},
})
