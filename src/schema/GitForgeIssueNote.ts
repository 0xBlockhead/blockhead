// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitForgeIssueNote,
	labels: {
		singular: 'Git forge issue note',
		plural: 'Git forge issue notes',
	},
})({
	$issue: {
		entityType: EntityType.GitForgeIssue,
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
		IssueNoteId: [
			'$issue',
			'noteId',
		],
	},
})
