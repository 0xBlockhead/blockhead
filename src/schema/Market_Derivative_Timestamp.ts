// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum Market_Derivative_TimestampSelector {
	MarketTimestampMsFeedKey = 'MarketTimestampMsFeedKey',
}
export const Market_Derivative_Timestamp = entity({
	entityType: EntityType.Market_Derivative_Timestamp,
	labels: {
		singular: 'market derivative timestamp',
		plural: 'market derivative observations',
	},
})({
	$market: {
		label: 'Market',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	feedKey: {
		label: 'Feed key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$parentMarket: {
		label: 'Parent market',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.One,
	},
	fundingRate: {
		label: 'Funding rate',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	openInterestUsd: {
		label: 'Open interest USD',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexBasisPercent: {
		label: 'Index basis percent',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	markPrice: {
		label: 'Mark price',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexPrice: {
		label: 'Index price',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expiredAtMs: {
		label: 'Expired at',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastTradedAtMs: {
		label: 'Last traded at',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerAssetId: {
		label: 'Provider asset ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transport: {
		label: 'Transport',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		MarketTimestampMsFeedKey: [
			'$market',
			'timestampMs',
			'feedKey',
		],
	},
})
