// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum MoveFunctionSelector {
	ModuleFunctionName = 'ModuleFunctionName',
}
export default {
	entityType: EntityType.MoveFunction,
	label: 'move function',
	labelPlural: 'move functions',
	selectors: [
		{
			name: MoveFunctionSelector.ModuleFunctionName,
			fields: [
				'$module',
				'functionName',
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
				name: 'functionName',
				label: 'function name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'visibility',
				label: 'visibility',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'isEntry',
				label: 'is entry',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'isView',
				label: 'is view',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'typeParameters',
				label: 'type parameters',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'parameters',
				label: 'parameters',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'returnTypes',
				label: 'return types',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
