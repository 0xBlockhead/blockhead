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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	rpcEndpoints: {
		label: 'RPC endpoints',
		primitiveType: type({
			url: type('string'),
			transportType: type('string'),
			providerName: type('string'),
		}),
		cardinality: EntityFieldCardinality.Many,
	},
	restEndpoints: {
		label: 'REST endpoints',
		primitiveType: type({
			url: type('string'),
			transportType: type('string'),
			providerName: type('string'),
		}),
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.HyperliquidNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		label: 'blocks',
		entityType: EntityType.HyperliquidBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.HyperliquidTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$validators: {
		label: 'validators',
		entityType: EntityType.HyperliquidValidator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$spotAssets: {
		label: 'spot assets',
		entityType: EntityType.HyperliquidSpotAsset,
		cardinality: EntityFieldCardinality.Many,
	},
	$$spotPairs: {
		label: 'spot pairs',
		entityType: EntityType.HyperliquidSpotPair,
		cardinality: EntityFieldCardinality.Many,
	},
	$$perpMarkets: {
		label: 'perp markets',
		entityType: EntityType.HyperliquidPerpMarket,
		cardinality: EntityFieldCardinality.Many,
	},
	$$vaults: {
		label: 'vaults',
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
