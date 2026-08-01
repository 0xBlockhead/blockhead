// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.McpServer,
	labels: {
		singular: 'mcp server',
		plural: 'mcp servers',
	},
})({
	serverKey: {
		label: 'server key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		entityType: EntityType.BlockheadSource,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$packageVersion: {
		label: 'package version',
		entityType: EntityType.McpServerPackageVersion,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transportKind: {
		label: 'transport kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endpointUrl: {
		label: 'endpoint URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$tools: {
		label: 'tools',
		entityType: EntityType.McpTool,
		cardinality: EntityFieldCardinality.Many,
	},
	$$resources: {
		label: 'resources',
		entityType: EntityType.McpResource,
		cardinality: EntityFieldCardinality.Many,
	},
	$$resourceTemplates: {
		label: 'resource templates',
		entityType: EntityType.McpResourceTemplate,
		cardinality: EntityFieldCardinality.Many,
	},
	$$prompts: {
		label: 'prompts',
		entityType: EntityType.McpPrompt,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
