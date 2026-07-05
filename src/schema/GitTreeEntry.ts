// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum GitTreeEntrySelector {
	TreePath = 'TreePath',
}
export default {
	entityType: EntityType.GitTreeEntry,
	label: 'Git tree entry',
	labelPlural: 'Git tree entries',
	selectors: [
		{
			name: GitTreeEntrySelector.TreePath,
			fields: [
				'$tree',
				'path',
			],
		},
	],
	fields: [
		{
				name: '$tree',
				label: 'tree',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.GitTree,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'path',
				label: 'path',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'mode',
				label: 'mode',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'objectId',
				label: 'object ID',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'objectKind',
				label: 'object kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$object',
				label: 'object',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.GitObject,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
