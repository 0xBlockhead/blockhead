// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidPerpMarket,
	labels: {
		singular: 'hyperliquid perp market',
		plural: 'hyperliquid perp markets',
	},
	description: 'Hyperliquid native perpetual market identified by network + coin (not EVM LiquidityPool).',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	coin: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.HyperliquidPerpMarket_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
})({
	selectors: {
		NetworkCoin: [
			'$network',
			'coin',
		],
	},
})
