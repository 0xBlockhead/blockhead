// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitRepository,
	labels: {
		singular: 'Git repository',
		plural: 'Git repositories',
	},
})({
	repositoryId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	canonicalRemoteUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	defaultRefName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	objectFormat: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$refs: {
		entityType: EntityType.GitRef,
		cardinality: EntityFieldCardinality.Many,
	},
	$$objects: {
		entityType: EntityType.GitObject,
		cardinality: EntityFieldCardinality.Many,
	},
	$$remotes: {
		entityType: EntityType.GitRemote,
		cardinality: EntityFieldCardinality.Many,
	},
	$$fetches: {
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
