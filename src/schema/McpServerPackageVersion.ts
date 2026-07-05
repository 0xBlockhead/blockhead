// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum McpServerPackageVersionSelector {
	PackageVersion = 'PackageVersion',
	Artifact = 'Artifact',
}
export default {
	entityType: EntityType.McpServerPackageVersion,
	label: 'mcp server package version',
	labelPlural: 'mcp server package versions',
	selectors: [
		{
			name: McpServerPackageVersionSelector.PackageVersion,
			fields: [
				'$package',
				'version',
			],
		},
		{
			name: McpServerPackageVersionSelector.Artifact,
			fields: [
				'$artifact',
			],
		},
	],
	fields: [
		{
				name: '$package',
				label: 'package',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.McpServerPackage,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'version',
				label: 'version',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$artifact',
				label: 'artifact',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AiArtifact,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'releaseDate',
				label: 'release date',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'registryStatus',
				label: 'registry status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'publishedAt',
				label: 'published AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'isLatest',
				label: 'is latest',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'packageRegistryType',
				label: 'package registry type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'packageRegistryBaseUrl',
				label: 'package registry base URL',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'packageIdentifier',
				label: 'package identifier',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'runtimeHint',
				label: 'runtime hint',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transportKind',
				label: 'transport kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'packages',
				label: 'packages',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'remotes',
				label: 'remotes',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'packageArguments',
				label: 'package arguments',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'runtimeArguments',
				label: 'runtime arguments',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'environmentVariables',
				label: 'environment variables',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'publisherMeta',
				label: 'publisher meta',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
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
