// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum DydxChainMarket_TimestampSelector {
	MarketTimestampMsSource = 'MarketTimestampMsSource',
}
export default {
	entityType: EntityType.DydxChainMarket_Timestamp,
	label: 'dydx chain market timestamp',
	labelPlural: 'dydx chain market observations',
	selectors: [
		{
			name: DydxChainMarket_TimestampSelector.MarketTimestampMsSource,
			fields: [
				'$market',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$market',
			label: 'market',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.DydxChainMarket,
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
			name: 'oraclePrice',
			label: 'oracle price',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fundingRate',
			label: 'funding rate',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'openInterest',
			label: 'open interest',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nextFundingAtMs',
			label: 'next funding at ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
