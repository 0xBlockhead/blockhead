// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MoveModule,
	labels: {
		singular: 'move module',
		plural: 'move modules',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	moduleName: {
		label: 'module name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MoveModule_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$functions: {
		label: 'functions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MoveFunction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$structs: {
		label: 'structs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MoveStruct,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAddressModuleName: [
			'$network',
			'address',
			'moduleName',
		],
	},
})
