// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.McpServerPackage,
	labels: {
		singular: 'MCP server package',
		plural: 'MCP server packages',
	},
})({
	registryServerName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	repositoryUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RegistryServerName: [
			'registryServerName',
		],
		RepositoryUrl: [
			'repositoryUrl',
		],
	},
})
