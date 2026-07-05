// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum KaspaAddressUtxo_TimestampSelector {
	AddressOutpointTransactionIdOutpointIndexTimestampMsSource = 'AddressOutpointTransactionIdOutpointIndexTimestampMsSource',
}
export default {
	entityType: EntityType.KaspaAddressUtxo_Timestamp,
	label: 'kaspa address UTXO timestamp',
	labelPlural: 'kaspa address UTXO observations',
	selectors: [
		{
			name: KaspaAddressUtxo_TimestampSelector.AddressOutpointTransactionIdOutpointIndexTimestampMsSource,
			fields: [
				'$address',
				'outpointTransactionId',
				'outpointIndex',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$address',
				label: 'Address',
				description: 'The address or account identifier used by the source protocol.',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.KaspaAddress,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'outpointTransactionId',
				label: 'outpoint transaction ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'outpointIndex',
				label: 'outpoint index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'amountSompi',
				label: 'amount sompi',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'scriptPublicKey',
				label: 'script public key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'blockDaaScore',
				label: 'block daa score',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'isCoinbase',
				label: 'is coinbase',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$output',
				label: 'output',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.UtxoOutput,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$spendingTransaction',
				label: 'spending transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.KaspaTransaction,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
