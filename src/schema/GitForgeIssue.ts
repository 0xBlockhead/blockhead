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
		entityType: EntityType.GitForgeMirror,
		cardinality: EntityFieldCardinality.One,
	},
	issueNumber: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	authorSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	labels: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	closedAt: {
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
