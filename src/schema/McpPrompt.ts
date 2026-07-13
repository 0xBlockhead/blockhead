// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum McpPromptSelector {
	ServerName = 'ServerName',
}
export const McpPrompt = entity({
	entityType: EntityType.McpPrompt,
	labels: {
		singular: 'mcp prompt',
		plural: 'mcp prompts',
	},
})({
	$server: {
		label: 'server',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		label: 'title',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	argumentsSchema: {
		label: 'arguments schema',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$results: {
		label: 'results',
		type: EntityFieldType.EntitiesReference,
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
