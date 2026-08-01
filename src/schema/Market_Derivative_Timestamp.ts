// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Market_Derivative_Timestamp,
	labels: {
		singular: 'market derivative timestamp',
		plural: 'market derivative observations',
	},
})({
	$market: {
		label: 'Market',
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	feedKey: {
		label: 'Feed key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$parentMarket: {
		label: 'Parent market',
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.One,
	},
	fundingRate: {
		label: 'Funding rate',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	openInterestUsd: {
		label: 'Open interest USD',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexBasisPercent: {
		label: 'Index basis percent',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	markPrice: {
		label: 'Mark price',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexPrice: {
		label: 'Index price',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expiredAtMs: {
		label: 'Expired at',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastTradedAtMs: {
		label: 'Last traded at',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerAssetId: {
		label: 'Provider asset ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transport: {
		label: 'Transport',
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
