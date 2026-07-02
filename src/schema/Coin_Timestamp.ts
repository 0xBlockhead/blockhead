// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum Coin_TimestampSelector {
	CoinTimestampMsSource = 'CoinTimestampMsSource',
}
export default {
	entityType: EntityType.Coin_Timestamp,
	label: 'coin timestamp',
	labelPlural: 'coin observations',
	selectors: [
		{
			name: Coin_TimestampSelector.CoinTimestampMsSource,
			fields: [
				'$coin',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$coin',
				label: 'Coin',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Coin,
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
				name: 'marketCapRank',
				label: 'Market cap rank',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'marketCapUsd',
				label: 'Market cap USD',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'marketCap',
				label: 'Market cap',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'change24hPercent',
				label: '24h change',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'totalSupply',
				label: 'Total supply',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transport',
				label: 'Transport',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'providerAssetId',
				label: 'Provider asset ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
