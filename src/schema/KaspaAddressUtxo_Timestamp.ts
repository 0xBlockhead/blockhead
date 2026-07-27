// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.KaspaAddress,
		cardinality: EntityFieldCardinality.One,
	},
	outpointTransactionId: {
		label: 'outpoint transaction ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	outpointIndex: {
		label: 'outpoint index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	amountSompi: {
		label: 'amount sompi',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scriptPublicKey: {
		label: 'script public key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockDaaScore: {
		label: 'block daa score',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isCoinbase: {
		label: 'is coinbase',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$output: {
		label: 'output',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$spendingTransaction: {
		label: 'spending transaction',
		type: EntityFieldType.EntityReference,
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
