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
	description: 'A deployed Uniswap V3 pool, uniquely addressed by its network and contract address or its factory, ordered token pair and fee. Factory, tokens, fee and tick spacing are immutable pool facts.',
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
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	},
	$token0: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	},
	$token1: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	},
	fee: {
		primitiveType: type('0 <= number.integer < 1000000'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	},
	tickSpacing: {
		primitiveType: type('0 < number.integer < 16384'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	},
	$poolContract: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	},
	$$blocks: {
		entityType: EntityType.UniswapV3Pool_Block,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	},
	$$positions: {
		entityType: EntityType.UniswapV3Position,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.UniswapContracts_Evm,
		],
	},
})({
	selectors: {
		NetworkPoolAddress: [
			'$network',
			'poolAddress',
		],
		FactoryToken0Token1Fee: [
			'$factory',
			'$token0',
			'$token1',
			'fee',
		],
	},
})
