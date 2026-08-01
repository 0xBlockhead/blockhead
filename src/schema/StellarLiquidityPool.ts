// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StellarLiquidityPool,
	labels: {
		singular: 'stellar liquidity pool',
		plural: 'stellar liquidity pools',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	liquidityPoolId: {
		label: 'liquidity pool ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	poolType: {
		label: 'pool type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$assetA: {
		label: 'asset a',
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$assetB: {
		label: 'asset b',
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeBps: {
		label: 'fee bps',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.StellarLiquidityPool_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkLiquidityPoolId: [
			'$network',
			'liquidityPoolId',
		],
	},
})
