// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitForgePullRequestNote,
	labels: {
		singular: 'Git forge pull request note',
		plural: 'Git forge pull request notes',
	},
})({
	$pullRequest: {
		entityType: EntityType.GitForgePullRequest,
		cardinality: EntityFieldCardinality.One,
	},
	noteId: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	body: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	noteType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	system: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	authorSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	discussionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	oldPath: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	newPath: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	oldLine: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	newLine: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	updatedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		PullRequestNoteId: [
			'$pullRequest',
			'noteId',
		],
	},
})
