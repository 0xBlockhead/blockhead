// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UniswapV3Position_Block,
	labels: {
		singular: 'Uniswap V3 position block',
		plural: 'Uniswap V3 position blocks',
	},
})({
	$position: {
		entityType: EntityType.UniswapV3Position,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	$owner: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Voltaire_JsonRpc,
		],
	},
	liquidity: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokensOwed0: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokensOwed1: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		PositionBlockNumber: [
			'$position',
			'blockNumber',
		],
	},
})
