// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitForgeMirror,
	labels: {
		singular: 'Git forge mirror',
		plural: 'Git forge mirrors',
	},
})({
	forgeHost: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	owner: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	repositoryName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$gitRepository: {
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	defaultBranch: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	visibility: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cloneUrls: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	htmlUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerRepositoryId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$issues: {
		entityType: EntityType.GitForgeIssue,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Gitlab_Rest,
		],
	},
	$$pullRequests: {
		entityType: EntityType.GitForgePullRequest,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Gitlab_Rest,
		],
	},
	$$releases: {
		entityType: EntityType.GitForgeRelease,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Gitlab_Rest,
		],
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
