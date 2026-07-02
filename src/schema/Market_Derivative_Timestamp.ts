// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum Market_Derivative_TimestampSelector {
	MarketTimestampMsFeedKey = 'MarketTimestampMsFeedKey',
}
export default {
	entityType: EntityType.Market_Derivative_Timestamp,
	label: 'market derivative timestamp',
	labelPlural: 'market derivative observations',
	selectors: [
		{
			name: Market_Derivative_TimestampSelector.MarketTimestampMsFeedKey,
			fields: [
				'$market',
				'timestampMs',
				'feedKey',
			],
		},
	],
	fields: [
		{
				name: '$market',
				label: 'Market',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Market,
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
				name: 'feedKey',
				label: 'Feed key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$parentMarket',
				label: 'Parent market',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'fundingRate',
				label: 'Funding rate',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'openInterestUsd',
				label: 'Open interest USD',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'indexBasisPercent',
				label: 'Index basis percent',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'markPrice',
				label: 'Mark price',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'indexPrice',
				label: 'Index price',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'expiredAtMs',
				label: 'Expired at',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'lastTradedAtMs',
				label: 'Last traded at',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'providerAssetId',
				label: 'Provider asset ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transport',
				label: 'Transport',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
