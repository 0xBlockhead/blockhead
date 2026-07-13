// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidNetworkSelector {
	Network = 'Network',
}
export const HyperliquidNetwork = entity({
	entityType: EntityType.HyperliquidNetwork,
	labels: {
		singular: 'hyperliquid network',
		plural: 'hyperliquid networks',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	rpcEndpoints: {
		label: 'RPC endpoints',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
		cardinality: EntityFieldCardinality.Many,
	},
	restEndpoints: {
		label: 'REST endpoints',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		label: 'blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$validators: {
		label: 'validators',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidValidator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$spotAssets: {
		label: 'spot assets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidSpotAsset,
		cardinality: EntityFieldCardinality.Many,
	},
	$$spotPairs: {
		label: 'spot pairs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidSpotPair,
		cardinality: EntityFieldCardinality.Many,
	},
	$$perpMarkets: {
		label: 'perp markets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidPerpMarket,
		cardinality: EntityFieldCardinality.Many,
	},
	$$vaults: {
		label: 'vaults',
		type: EntityFieldType.EntitiesReference,
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
