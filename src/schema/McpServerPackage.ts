import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum McpServerPackageSelector {
	RegistryServerName = 'registryServerName',
	RepositoryUrl = 'repositoryUrl',
}
export default {
	entityType: EntityType.McpServerPackage,
	label: 'mcp server package',
	labelPlural: 'mcp server packages',
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
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'repositoryUrl',
			label: 'repository URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'repositorySource',
			label: 'repository source',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'repositoryId',
			label: 'repository ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'repositorySubfolder',
			label: 'repository subfolder',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'websiteUrl',
			label: 'website URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			label: 'Description',
			description: 'A human-readable description from the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'license',
			label: 'license',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$versions',
			label: 'versions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.McpServerPackageVersion,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$documents',
			label: 'documents',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AiDocument,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
