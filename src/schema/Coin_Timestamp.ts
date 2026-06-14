import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Coin from '$/schema/Coin.ts'
import { Source } from '$/sources/Source.ts'

export enum Coin_TimestampSelector {
	CoinTimestampMs = 'coinTimestampMs',
}

export default {
	entityType: EntityType.Coin_Timestamp,

	label: 'Coin Timestamp',
	labelPlural: 'Coin Timestamps',

	selectors: [
		{
			name: Coin_TimestampSelector.CoinTimestampMs,
			fields: [
				'$coin',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$coin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Coin,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'marketCap',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'change24hPercent',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: 'transport',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'providerAssetId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'totalSupply',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
