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
		label: 'server',
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		label: 'title',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	argumentsSchema: {
		label: 'arguments schema',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$results: {
		label: 'results',
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
