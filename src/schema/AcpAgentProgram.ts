import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AcpAgentProgramSelector {
	RegistryAgentId = 'registryAgentId',
	PackageName = 'packageName',
	RepositoryUrl = 'repositoryUrl',
}
export default {
	entityType: EntityType.AcpAgentProgram,
	label: 'acp agent program',
	labelPlural: 'acp agent programs',
	selectors: [
		{
			name: AcpAgentProgramSelector.RegistryAgentId,
			fields: [
				'registryAgentId',
			],
		},
		{
			name: AcpAgentProgramSelector.PackageName,
			fields: [
				'packageName',
			],
		},
		{
			name: AcpAgentProgramSelector.RepositoryUrl,
			fields: [
				'repositoryUrl',
			],
		},
	],
	fields: [
		{
			name: 'registryAgentId',
			label: 'registry agent ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'packageName',
			label: 'package name',
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
			name: 'authors',
			label: 'authors',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
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
			name: 'supportsAuthentication',
			label: 'supports authentication',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$versions',
			label: 'versions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AcpAgentProgramVersion,
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
