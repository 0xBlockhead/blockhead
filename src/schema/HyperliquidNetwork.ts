// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidNetwork,
	labels: {
		singular: 'hyperliquid network',
		plural: 'hyperliquid networks',
	},
	description: 'Hyperliquid L1 network hub — native perps/spot/validators (not EVM LiquidityPool).',
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
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	restEndpoints: {
		primitiveType: type({
			url: type('string'),
			transportType: type('string'),
			providerName: type('string'),
		}),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	$$timestamps: {
		entityType: EntityType.HyperliquidNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	$$blocks: {
		entityType: EntityType.HyperliquidBlock,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	$$transactions: {
		entityType: EntityType.HyperliquidTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	$$validators: {
		entityType: EntityType.HyperliquidValidator,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	$$spotAssets: {
		entityType: EntityType.HyperliquidSpotAsset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	$$spotPairs: {
		entityType: EntityType.HyperliquidSpotPair,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	$$perpMarkets: {
		entityType: EntityType.HyperliquidPerpMarket,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	$$vaults: {
		entityType: EntityType.HyperliquidVault,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
