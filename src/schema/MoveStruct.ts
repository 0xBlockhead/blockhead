// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum MoveStructSelector {
	ModuleStructName = 'ModuleStructName',
}
export default {
	entityType: EntityType.MoveStruct,
	label: 'move struct',
	labelPlural: 'move structs',
	selectors: [
		{
			name: MoveStructSelector.ModuleStructName,
			fields: [
				'$module',
				'structName',
			],
		},
	],
	fields: [
		{
				name: '$module',
				label: 'module',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.MoveModule,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'structName',
				label: 'struct name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'isNative',
				label: 'is native',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'isEvent',
				label: 'is event',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'abilities',
				label: 'abilities',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'typeParameters',
				label: 'type parameters',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'fields',
				label: 'fields',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'name': type('string'), 'type': type('string') }),
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
