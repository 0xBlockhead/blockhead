// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UniswapV3Pool,
	labels: {
		singular: 'Uniswap V3 pool',
		plural: 'Uniswap V3 pools',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	poolAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$factory: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniswapContracts_Evm,
			Source.Voltaire_JsonRpc,
		],
	},
	$token0: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	},
	$token1: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	},
	fee: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tickSpacing: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$poolContract: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blocks: {
		entityType: EntityType.UniswapV3Pool_Block,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Voltaire_JsonRpc,
		],
	},
	$$positions: {
		entityType: EntityType.UniswapV3Position,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	},
})({
	selectors: {
		NetworkPoolAddress: [
			'$network',
			'poolAddress',
		],
		Token0Token1Fee: [
			'$token0',
			'$token1',
			'fee',
		],
	},
})
