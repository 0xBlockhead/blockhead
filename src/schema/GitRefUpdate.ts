// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum GitRefUpdateSelector {
	RepositoryRefNameOldObjectIdNewObjectId = 'RepositoryRefNameOldObjectIdNewObjectId',
}
export default {
	entityType: EntityType.GitRefUpdate,
	label: 'Git ref update',
	labelPlural: 'Git ref updates',
	selectors: [
		{
			name: GitRefUpdateSelector.RepositoryRefNameOldObjectIdNewObjectId,
			fields: [
				'$repository',
				'refName',
				'oldObjectId',
				'newObjectId',
			],
		},
	],
	fields: [
		{
				name: '$repository',
				label: 'repository',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.GitRepository,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'refName',
				label: 'ref name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'oldObjectId',
				label: 'old object ID',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'newObjectId',
				label: 'new object ID',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'updateKind',
				label: 'update kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'actorSelector',
				label: 'actor selector',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$signature',
				label: 'signature',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.GitSignature,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
