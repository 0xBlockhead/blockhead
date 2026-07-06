// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum GitForgeMirrorSelector {
	ForgeHostOwnerRepositoryName = 'ForgeHostOwnerRepositoryName',
}
export default {
	entityType: EntityType.GitForgeMirror,
	label: 'Git forge mirror',
	labelPlural: 'Git forge mirrors',
	selectors: [
		{
			name: GitForgeMirrorSelector.ForgeHostOwnerRepositoryName,
			fields: [
				'forgeHost',
				'owner',
				'repositoryName',
			],
		},
	],
	fields: [
		{
			name: 'forgeHost',
			label: 'forge host',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'owner',
			label: 'owner',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'repositoryName',
			label: 'repository name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$gitRepository',
			label: 'Git repository',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.GitRepository,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'defaultBranch',
			label: 'default branch',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'visibility',
			label: 'visibility',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'cloneUrls',
			label: 'clone urls',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'htmlUrl',
			label: 'HTML URL',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'providerRepositoryId',
			label: 'provider repository ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
