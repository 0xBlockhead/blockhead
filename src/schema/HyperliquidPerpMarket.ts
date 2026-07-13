// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidPerpMarketSelector {
	NetworkCoin = 'NetworkCoin',
}
export const HyperliquidPerpMarket = entity({
	entityType: EntityType.HyperliquidPerpMarket,
	labels: {
		singular: 'hyperliquid perp market',
		plural: 'hyperliquid perp markets',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	coin: {
		label: 'coin',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidPerpMarket_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkCoin: [
			'$network',
			'coin',
		],
	},
})
