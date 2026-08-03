// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const tronScanRestSources = [
	Source.TronScan_Rest,
] as const

export default entity({
	entityType: EntityType.TronTokenTransfer,
	labels: {
		singular: 'tron token transfer',
		plural: 'tron token transfers',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	transactionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transferIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		entityType: EntityType.TronTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	$token: {
		entityType: EntityType.TronToken,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	standard: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	$from: {
		entityType: EntityType.TronAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	$to: {
		entityType: EntityType.TronAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	amount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
})({
	selectors: {
		NetworkTransactionIdTransferIndex: [
			'$network',
			'transactionId',
			'transferIndex',
		],
	},
})
