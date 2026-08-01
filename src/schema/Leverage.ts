// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Leverage,
	labels: {
		singular: 'leverage',
		plural: 'leverages',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	id: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$pool: {
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.One,
	},
	$owner: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	tickLower: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	tickUpper: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	liquidity: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	token0Owed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	token1Owed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	origin: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAtTimestamp: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EvmNetworkId: [
			'$network',
			'id',
		],
	},
})
