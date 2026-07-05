// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum GitObjectSelector {
	ObjectIdObjectFormat = 'ObjectIdObjectFormat',
}
export default {
	entityType: EntityType.GitObject,
	label: 'Git object',
	labelPlural: 'Git objects',
	selectors: [
		{
			name: GitObjectSelector.ObjectIdObjectFormat,
			fields: [
				'objectId',
				'objectFormat',
			],
		},
	],
	fields: [
		{
				name: 'objectId',
				label: 'object ID',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'objectFormat',
				label: 'object format',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
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
				name: 'sizeBytes',
				label: 'size bytes',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$repository',
				label: 'repository',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.GitRepository,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
