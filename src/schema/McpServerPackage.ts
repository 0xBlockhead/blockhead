// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum McpServerPackageSelector {
	RegistryServerName = 'RegistryServerName',
	RepositoryUrl = 'RepositoryUrl',
}
export const McpServerPackage = entity({
	entityType: EntityType.McpServerPackage,
	label: 'MCP server package',
	labelPlural: 'MCP server packages',
})({
	registryServerName: {
		label: 'registry server name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	repositoryUrl: {
		label: 'repository URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		type: EntityFieldType.Primitive,
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
