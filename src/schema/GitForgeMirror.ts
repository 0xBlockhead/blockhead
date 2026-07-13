// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum GitForgeMirrorSelector {
	ForgeHostOwnerRepositoryName = 'ForgeHostOwnerRepositoryName',
}
export const GitForgeMirror = entity({
	entityType: EntityType.GitForgeMirror,
	labels: {
		singular: 'Git forge mirror',
		plural: 'Git forge mirrors',
	},
})({
	forgeHost: {
		label: 'forge host',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	owner: {
		label: 'owner',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	repositoryName: {
		label: 'repository name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$gitRepository: {
		label: 'Git repository',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	defaultBranch: {
		label: 'default branch',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	visibility: {
		label: 'visibility',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cloneUrls: {
		label: 'clone urls',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	htmlUrl: {
		label: 'HTML URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerRepositoryId: {
		label: 'provider repository ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ForgeHostOwnerRepositoryName: [
			'forgeHost',
			'owner',
			'repositoryName',
		],
	},
})
