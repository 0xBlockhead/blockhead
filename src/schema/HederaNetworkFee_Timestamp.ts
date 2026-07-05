// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaNetworkFee_TimestampSelector {
	NetworkTransactionTypeTimestampMsSource = 'NetworkTransactionTypeTimestampMsSource',
}
export default {
	entityType: EntityType.HederaNetworkFee_Timestamp,
	label: 'hedera network fee timestamp',
	labelPlural: 'hedera network fee observations',
	selectors: [
		{
			name: HederaNetworkFee_TimestampSelector.NetworkTransactionTypeTimestampMsSource,
			fields: [
				'$network',
				'transactionType',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'transactionType',
				label: 'transaction type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
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
				name: 'gasTinybar',
				label: 'gas tinybar',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'baseTinycent',
				label: 'base tinycent',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nodeTinycent',
				label: 'node tinycent',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'networkTinycent',
				label: 'network tinycent',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'serviceTinycent',
				label: 'service tinycent',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'totalTinycent',
				label: 'total tinycent',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'extras',
				label: 'extras',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
