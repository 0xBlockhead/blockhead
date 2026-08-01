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
		label: 'module',
		entityType: EntityType.MoveModule,
		cardinality: EntityFieldCardinality.One,
	},
	structName: {
		label: 'struct name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	isNative: {
		label: 'is native',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isEvent: {
		label: 'is event',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	abilities: {
		label: 'abilities',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	typeParameters: {
		label: 'type parameters',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.Many,
	},
	fields: {
		label: 'fields',
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
