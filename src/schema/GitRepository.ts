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
		label: 'repository ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	canonicalRemoteUrl: {
		label: 'canonical remote URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	defaultRefName: {
		label: 'default ref name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	objectFormat: {
		label: 'object format',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$refs: {
		label: 'refs',
		entityType: EntityType.GitRef,
		cardinality: EntityFieldCardinality.Many,
	},
	$$objects: {
		label: 'objects',
		entityType: EntityType.GitObject,
		cardinality: EntityFieldCardinality.Many,
	},
	$$remotes: {
		label: 'remotes',
		entityType: EntityType.GitRemote,
		cardinality: EntityFieldCardinality.Many,
	},
	$$fetches: {
		label: 'fetches',
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
