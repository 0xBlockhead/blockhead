// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BnbBeaconTokenTransfer,
	labels: {
		singular: 'bnb beacon token transfer',
		plural: 'bnb beacon token transfers',
	},
})({
	$transaction: {
		entityType: EntityType.BnbBeaconTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	transferIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fromAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	$token: {
		entityType: EntityType.BnbBeaconToken,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionTransferIndex: [
			'$transaction',
			'transferIndex',
		],
	},
})
