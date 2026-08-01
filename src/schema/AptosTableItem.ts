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
		label: 'network',
		entityType: EntityType.AptosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	tableHandle: {
		label: 'table handle',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	keyHash: {
		label: 'key hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	key: {
		label: 'key',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	keyType: {
		label: 'key type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueType: {
		label: 'value type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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
