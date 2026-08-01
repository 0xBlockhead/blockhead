// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitForgeIssue,
	labels: {
		singular: 'Git forge issue',
		plural: 'Git forge issues',
	},
})({
	$forgeMirror: {
		label: 'forge mirror',
		entityType: EntityType.GitForgeMirror,
		cardinality: EntityFieldCardinality.One,
	},
	issueNumber: {
		label: 'issue number',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		label: 'title',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		label: 'state',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	authorSelector: {
		label: 'author selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	labels: {
		label: 'labels',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
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
	closedAt: {
		label: 'closed AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ForgeMirrorIssueNumber: [
			'$forgeMirror',
			'issueNumber',
		],
	},
})
