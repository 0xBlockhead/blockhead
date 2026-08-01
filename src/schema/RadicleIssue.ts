// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RadicleIssue,
	labels: {
		singular: 'radicle issue',
		plural: 'radicle issues',
	},
})({
	$repository: {
		label: 'repository',
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.One,
	},
	issueId: {
		label: 'issue ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		label: 'title',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authorDid: {
		label: 'author DID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		label: 'state',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAt: {
		label: 'Updated',
		description: 'The time when the subject was last updated according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payloadObjectId: {
		label: 'payload object ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$payloadObject: {
		label: 'payload object',
		entityType: EntityType.GitObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$comments: {
		label: 'comments',
		entityType: EntityType.RadicleDiscussionComment,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		RepositoryIssueId: [
			'$repository',
			'issueId',
		],
	},
})
