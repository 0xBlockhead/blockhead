import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum GitRepositorySelector {
	RepositoryId = 'repositoryId',
	CanonicalRemoteUrl = 'canonicalRemoteUrl',
}
export default {
	entityType: EntityType.GitRepository,
	label: 'Git repository',
	labelPlural: 'Git repositories',
	selectors: [
		{
			name: GitRepositorySelector.RepositoryId,
			fields: [
				'repositoryId',
			],
		},
		{
			name: GitRepositorySelector.CanonicalRemoteUrl,
			fields: [
				'canonicalRemoteUrl',
			],
		},
	],
	fields: [
		{
			name: 'repositoryId',
			label: 'repository ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'canonicalRemoteUrl',
			label: 'canonical remote URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'defaultRefName',
			label: 'default ref name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'objectFormat',
			label: 'object format',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$refs',
			label: 'refs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.GitRef,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$objects',
			label: 'objects',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.GitObject,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$remotes',
			label: 'remotes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.GitRemote,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$fetches',
			label: 'fetches',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.GitFetchObservation,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
