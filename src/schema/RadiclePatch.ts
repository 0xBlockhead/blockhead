// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RadiclePatchSelector {
	RepositoryPatchId = 'RepositoryPatchId',
}
export default {
	entityType: EntityType.RadiclePatch,
	label: 'radicle patch',
	labelPlural: 'radicle patches',
	selectors: [
		{
			name: RadiclePatchSelector.RepositoryPatchId,
			fields: [
				'$repository',
				'patchId',
			],
		},
	],
	fields: [
		{
				name: '$repository',
				label: 'repository',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.RadicleRepository,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'patchId',
				label: 'patch ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'authorDid',
				label: 'author DID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'targetRef',
				label: 'target ref',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'headObjectId',
				label: 'head object ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'baseObjectId',
				label: 'base object ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'state',
				label: 'state',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'createdAt',
				label: 'Created',
				description: 'The time when the subject was created according to the source.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'updatedAt',
				label: 'Updated',
				description: 'The time when the subject was last updated according to the source.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$headCommit',
				label: 'head commit',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.GitCommit,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$baseCommit',
				label: 'base commit',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.GitCommit,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$comments',
				label: 'comments',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.RadicleDiscussionComment,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
