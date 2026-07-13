// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum GitRepositorySelector {
	RepositoryId = 'RepositoryId',
	CanonicalRemoteUrl = 'CanonicalRemoteUrl',
}
export const GitRepository = entity({
	entityType: EntityType.GitRepository,
	labels: {
		singular: 'Git repository',
		plural: 'Git repositories',
	},
})({
	repositoryId: {
		label: 'repository ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	canonicalRemoteUrl: {
		label: 'canonical remote URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	defaultRefName: {
		label: 'default ref name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	objectFormat: {
		label: 'object format',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$refs: {
		label: 'refs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.GitRef,
		cardinality: EntityFieldCardinality.Many,
	},
	$$objects: {
		label: 'objects',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.GitObject,
		cardinality: EntityFieldCardinality.Many,
	},
	$$remotes: {
		label: 'remotes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.GitRemote,
		cardinality: EntityFieldCardinality.Many,
	},
	$$fetches: {
		label: 'fetches',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.GitFetchObservation,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		RepositoryId: [
			'repositoryId',
		],
		CanonicalRemoteUrl: [
			'canonicalRemoteUrl',
		],
	},
})
