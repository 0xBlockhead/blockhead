// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum McpServerPackageSelector {
	RegistryServerName = 'RegistryServerName',
	RepositoryUrl = 'RepositoryUrl',
}
export default {
	entityType: EntityType.McpServerPackage,
	label: 'MCP server package',
	labelPlural: 'MCP server packages',
	selectors: [
		{
			name: McpServerPackageSelector.RegistryServerName,
			fields: [
				'registryServerName',
			],
		},
		{
			name: McpServerPackageSelector.RepositoryUrl,
			fields: [
				'repositoryUrl',
			],
		},
	],
	fields: [
		{
			name: 'registryServerName',
			label: 'registry server name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'repositoryUrl',
			label: 'repository URL',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
