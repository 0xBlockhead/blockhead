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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$source: {
		entityType: EntityType.BlockheadSource,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$packageVersion: {
		entityType: EntityType.McpServerPackageVersion,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transportKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endpointUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$tools: {
		entityType: EntityType.McpTool,
		cardinality: EntityFieldCardinality.Many,
	},
	$$resources: {
		entityType: EntityType.McpResource,
		cardinality: EntityFieldCardinality.Many,
	},
	$$resourceTemplates: {
		entityType: EntityType.McpResourceTemplate,
		cardinality: EntityFieldCardinality.Many,
	},
	$$prompts: {
		entityType: EntityType.McpPrompt,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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
