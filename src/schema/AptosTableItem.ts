// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AptosTableItem,
	labels: {
		singular: 'aptos table item',
		plural: 'aptos table items',
	},
})({
	$network: {
		entityType: EntityType.AptosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	tableHandle: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	keyHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	key: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	keyType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.AptosTableItem_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkTableHandleKeyHash: [
			'$network',
			'tableHandle',
			'keyHash',
		],
	},
})
