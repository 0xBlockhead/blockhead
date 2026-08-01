// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RadiclePatch,
	labels: {
		singular: 'radicle patch',
		plural: 'radicle patches',
	},
})({
	$repository: {
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.One,
	},
	patchId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	authorDid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	targetRef: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	headObjectId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	baseObjectId: {
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
	$headCommit: {
		entityType: EntityType.GitCommit,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseCommit: {
		entityType: EntityType.GitCommit,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$comments: {
		entityType: EntityType.RadicleDiscussionComment,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		RepositoryPatchId: [
			'$repository',
			'patchId',
		],
	},
})
