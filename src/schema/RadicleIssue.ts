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
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.One,
	},
	issueId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authorDid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payloadObjectId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$payloadObject: {
		entityType: EntityType.GitObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RepositoryIssueId: [
			'$repository',
			'issueId',
		],
	},
})
