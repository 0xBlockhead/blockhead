// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.MoveModule,
		cardinality: EntityFieldCardinality.One,
	},
	functionName: {
		label: 'function name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	visibility: {
		label: 'visibility',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isEntry: {
		label: 'is entry',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isView: {
		label: 'is view',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	typeParameters: {
		label: 'type parameters',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.Many,
	},
	parameters: {
		label: 'parameters',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	returnTypes: {
		label: 'return types',
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
