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
		entityType: EntityType.MoveModule,
		cardinality: EntityFieldCardinality.One,
	},
	functionName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	visibility: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isEntry: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isView: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	typeParameters: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.Many,
	},
	parameters: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	returnTypes: {
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
