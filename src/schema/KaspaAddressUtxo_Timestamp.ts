// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.KaspaAddressUtxo_Timestamp,
	labels: {
		singular: 'kaspa address UTXO timestamp',
		plural: 'kaspa address UTXO observations',
	},
})({
	$address: {
		entityType: EntityType.KaspaAddress,
		cardinality: EntityFieldCardinality.One,
	},
	outpointTransactionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	outpointIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	amountSompi: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scriptPublicKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockDaaScore: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isCoinbase: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$output: {
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$spendingTransaction: {
		entityType: EntityType.KaspaTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AddressOutpointTransactionIdOutpointIndexTimestampMsSource: [
			'$address',
			'outpointTransactionId',
			'outpointIndex',
			'timestampMs',
			'source',
		],
	},
})
