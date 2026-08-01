// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitForgeMirror,
	labels: {
		singular: 'Git forge mirror',
		plural: 'Git forge mirrors',
	},
})({
	forgeHost: {
		label: 'forge host',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	owner: {
		label: 'owner',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	repositoryName: {
		label: 'repository name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$gitRepository: {
		label: 'Git repository',
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	defaultBranch: {
		label: 'default branch',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	visibility: {
		label: 'visibility',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cloneUrls: {
		label: 'clone urls',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	htmlUrl: {
		label: 'HTML URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerRepositoryId: {
		label: 'provider repository ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
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
