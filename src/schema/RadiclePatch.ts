// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.One,
	},
	patchId: {
		label: 'patch ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	authorDid: {
		label: 'author DID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	targetRef: {
		label: 'target ref',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	headObjectId: {
		label: 'head object ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	baseObjectId: {
		label: 'base object ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		label: 'state',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAt: {
		label: 'Updated',
		description: 'The time when the subject was last updated according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$headCommit: {
		label: 'head commit',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.GitCommit,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseCommit: {
		label: 'base commit',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.GitCommit,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$comments: {
		label: 'comments',
		type: EntityFieldType.EntitiesReference,
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
