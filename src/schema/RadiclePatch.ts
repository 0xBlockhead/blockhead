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
		label: 'repository',
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.One,
	},
	patchId: {
		label: 'patch ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	authorDid: {
		label: 'author DID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	targetRef: {
		label: 'target ref',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	headObjectId: {
		label: 'head object ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	baseObjectId: {
		label: 'base object ID',
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
	$headCommit: {
		label: 'head commit',
		entityType: EntityType.GitCommit,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseCommit: {
		label: 'base commit',
		entityType: EntityType.GitCommit,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$comments: {
		label: 'comments',
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
