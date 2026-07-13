// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum GitCommitSelector {
	ObjectIdObjectFormat = 'ObjectIdObjectFormat',
}
export const GitCommit = entity({
	entityType: EntityType.GitCommit,
	labels: {
		singular: 'Git commit',
		plural: 'Git commits',
	},
})({
	objectId: {
		label: 'object ID',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.One,
	},
	objectFormat: {
		label: 'object format',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$object: {
		label: 'object',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.GitObject,
		cardinality: EntityFieldCardinality.One,
	},
	treeObjectId: {
		label: 'tree object ID',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.One,
	},
	parentObjectIds: {
		label: 'parent object ids',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.Many,
	},
	authorName: {
		label: 'author name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authorEmail: {
		label: 'author email',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authorTimestampMs: {
		label: 'author timestamp ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	committerName: {
		label: 'committer name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	committerEmail: {
		label: 'committer email',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	committerTimestampMs: {
		label: 'committer timestamp ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	message: {
		label: 'message',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$signatures: {
		label: 'signatures',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.GitSignature,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ObjectIdObjectFormat: [
			'objectId',
			'objectFormat',
		],
	},
})
