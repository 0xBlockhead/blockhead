import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum McpServerSelector {
	ServerKey = 'serverKey',
}
export default {
	entityType: EntityType.McpServer,
	label: 'mcp server',
	labelPlural: 'mcp servers',
	selectors: [
		{
			name: McpServerSelector.ServerKey,
			fields: [
				'serverKey',
			],
		},
	],
	fields: [
		{
			name: 'serverKey',
			label: 'server key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadSource,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$packageVersion',
			label: 'package version',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.McpServerPackageVersion,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transportKind',
			label: 'transport kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'endpointUrl',
			label: 'endpoint URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$tools',
			label: 'tools',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.McpTool,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$resources',
			label: 'resources',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.McpResource,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$resourceTemplates',
			label: 'resource templates',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.McpResourceTemplate,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$prompts',
			label: 'prompts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.McpPrompt,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.McpServer_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
