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
		label: 'transaction',
		entityType: EntityType.BnbBeaconTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	transferIndex: {
		label: 'transfer index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fromAddress: {
		label: 'from address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAddress: {
		label: 'to address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	$token: {
		label: 'token',
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
