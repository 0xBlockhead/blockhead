// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UtxoTransaction_Mempool_Timestamp,
	labels: {
		singular: 'UTXO transaction mempool observation',
		plural: 'UTXO transaction mempool observations',
	},
})({
	$transaction: {
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	witnessTransactionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	virtualSizeBytes: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	weightUnits: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	ancestorCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	ancestorSizeBytes: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	descendantCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	descendantSizeBytes: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	baseFeeSats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	modifiedFeeSats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	ancestorFeeSats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	descendantFeeSats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	bip125Replaceable: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	unbroadcast: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$dependsOnTransactions: {
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$spentByTransactions: {
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		TransactionTimestampMsSource: [
			'$transaction',
			'timestampMs',
			'source',
		],
	},
})
