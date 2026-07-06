// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum McpPromptSelector {
	ServerName = 'ServerName',
}
export default {
	entityType: EntityType.McpPrompt,
	label: 'mcp prompt',
	labelPlural: 'mcp prompts',
	selectors: [
		{
			name: McpPromptSelector.ServerName,
			fields: [
				'$server',
				'name',
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
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'title',
			label: 'title',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			label: 'Description',
			description: 'A human-readable description from the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'argumentsSchema',
			label: 'arguments schema',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$results',
			label: 'results',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.McpPromptResult,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
