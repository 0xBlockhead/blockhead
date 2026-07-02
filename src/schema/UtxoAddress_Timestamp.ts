// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum UtxoAddress_TimestampSelector {
	AddressTimestampMsSource = 'AddressTimestampMsSource',
}
export default {
	entityType: EntityType.UtxoAddress_Timestamp,
	label: 'UTXO address timestamp',
	labelPlural: 'UTXO address observations',
	selectors: [
		{
			name: UtxoAddress_TimestampSelector.AddressTimestampMsSource,
			fields: [
				'$address',
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
				entityType: EntityType.UtxoAddress,
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
				name: 'balanceSats',
				label: 'Balance',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'fundedOutputCount',
				label: 'Funded output count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'fundedValueSats',
				label: 'Funded value',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'spentOutputCount',
				label: 'Spent output count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'spentValueSats',
				label: 'Spent value',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transactionCount',
				label: 'Transaction count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'unspentOutputCount',
				label: 'Unspent output count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'mempoolTransactionCount',
				label: 'Mempool transaction count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
