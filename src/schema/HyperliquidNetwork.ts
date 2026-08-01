// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidNetwork,
	labels: {
		singular: 'hyperliquid network',
		plural: 'hyperliquid networks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	rpcEndpoints: {
		primitiveType: type({
			url: type('string'),
			transportType: type('string'),
			providerName: type('string'),
		}),
		cardinality: EntityFieldCardinality.Many,
	},
	restEndpoints: {
		primitiveType: type({
			url: type('string'),
			transportType: type('string'),
			providerName: type('string'),
		}),
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.HyperliquidNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		entityType: EntityType.HyperliquidBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		entityType: EntityType.HyperliquidTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$validators: {
		entityType: EntityType.HyperliquidValidator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$spotAssets: {
		entityType: EntityType.HyperliquidSpotAsset,
		cardinality: EntityFieldCardinality.Many,
	},
	$$spotPairs: {
		entityType: EntityType.HyperliquidSpotPair,
		cardinality: EntityFieldCardinality.Many,
	},
	$$perpMarkets: {
		entityType: EntityType.HyperliquidPerpMarket,
		cardinality: EntityFieldCardinality.Many,
	},
	$$vaults: {
		entityType: EntityType.HyperliquidVault,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
