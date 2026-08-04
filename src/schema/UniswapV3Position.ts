// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UniswapV3Position,
	labels: {
		singular: 'Uniswap V3 position',
		plural: 'Uniswap V3 positions',
	},
})({
	positionManager: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	$pool: {
		entityType: EntityType.UniswapV3Pool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	},
	tickLower: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tickUpper: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blocks: {
		entityType: EntityType.UniswapV3Position_Block,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Voltaire_JsonRpc,
		],
	},
})({
	selectors: {
		PositionManagerTokenId: [
			'positionManager',
			'tokenId',
		],
	},
})
