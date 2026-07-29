// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MoveModule,
		cardinality: EntityFieldCardinality.One,
	},
	structName: {
		label: 'struct name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	isNative: {
		label: 'is native',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isEvent: {
		label: 'is event',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	abilities: {
		label: 'abilities',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	typeParameters: {
		label: 'type parameters',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.Many,
	},
	fields: {
		label: 'fields',
		type: EntityFieldType.Primitive,
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
