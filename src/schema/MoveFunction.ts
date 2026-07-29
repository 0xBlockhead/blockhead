// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MoveFunction,
	labels: {
		singular: 'move function',
		plural: 'move functions',
	},
})({
	$module: {
		label: 'module',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MoveModule,
		cardinality: EntityFieldCardinality.One,
	},
	functionName: {
		label: 'function name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	visibility: {
		label: 'visibility',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isEntry: {
		label: 'is entry',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isView: {
		label: 'is view',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	typeParameters: {
		label: 'type parameters',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.Many,
	},
	parameters: {
		label: 'parameters',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	returnTypes: {
		label: 'return types',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ModuleFunctionName: [
			'$module',
			'functionName',
		],
	},
})
