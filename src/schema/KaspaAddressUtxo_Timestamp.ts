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
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		entityType: EntityType.KaspaAddress,
		cardinality: EntityFieldCardinality.One,
	},
	outpointTransactionId: {
		label: 'outpoint transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	outpointIndex: {
		label: 'outpoint index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	amountSompi: {
		label: 'amount sompi',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scriptPublicKey: {
		label: 'script public key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockDaaScore: {
		label: 'block daa score',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isCoinbase: {
		label: 'is coinbase',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$output: {
		label: 'output',
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$spendingTransaction: {
		label: 'spending transaction',
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
