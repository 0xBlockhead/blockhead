// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidBalance,
	labels: {
		singular: 'hyperliquid balance',
		plural: 'hyperliquid balances',
	},
})({
	$account: {
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.One,
	},
	tokenIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	coin: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	total: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	hold: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	entryNtl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		AccountTokenIndex: [
			'$account',
			'tokenIndex',
		],
	},
})
