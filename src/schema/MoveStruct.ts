// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MoveStruct,
	labels: {
		singular: 'move struct',
		plural: 'move structs',
	},
})({
	$module: {
		entityType: EntityType.MoveModule,
		cardinality: EntityFieldCardinality.One,
	},
	structName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	isNative: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isEvent: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	abilities: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	typeParameters: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.Many,
	},
	fields: {
		primitiveType: type({
			name: type('string'),
			type: type('string'),
		}),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ModuleStructName: [
			'$module',
			'structName',
		],
	},
})
