// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum GitPackfileSelector {
	PackHash = 'PackHash',
}
export default {
	entityType: EntityType.GitPackfile,
	label: 'Git packfile',
	labelPlural: 'Git packfiles',
	selectors: [
		{
			name: GitPackfileSelector.PackHash,
			fields: [
				'packHash',
			],
		},
	],
	fields: [
		{
			name: 'packHash',
			label: 'pack hash',
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
			name: 'objectCount',
			label: 'object count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'packSizeBytes',
			label: 'pack size bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'indexHash',
			label: 'index hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
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
