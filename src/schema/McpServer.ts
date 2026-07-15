// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum McpServerSelector {
	ServerKey = 'ServerKey',
}
export const McpServer = entity({
	entityType: EntityType.McpServer,
	labels: {
		singular: 'mcp server',
		plural: 'mcp servers',
	},
})({
	serverKey: {
		label: 'server key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadSource,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$packageVersion: {
		label: 'package version',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.McpServerPackageVersion,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transportKind: {
		label: 'transport kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endpointUrl: {
		label: 'endpoint URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$tools: {
		label: 'tools',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.McpTool,
		cardinality: EntityFieldCardinality.Many,
	},
	$$resources: {
		label: 'resources',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.McpResource,
		cardinality: EntityFieldCardinality.Many,
	},
	$$resourceTemplates: {
		label: 'resource templates',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.McpResourceTemplate,
		cardinality: EntityFieldCardinality.Many,
	},
	$$prompts: {
		label: 'prompts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.McpPrompt,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.McpServer_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ServerKey: [
			'serverKey',
		],
	},
})
