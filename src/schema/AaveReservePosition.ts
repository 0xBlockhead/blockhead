// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AaveReservePosition,
	labels: {
		singular: 'Aave reserve position',
		plural: 'Aave reserve positions',
	},
	description: 'An account supply and/or borrow balance against one Aave V3 reserve.',
})({
	$account: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$reserve: {
		entityType: EntityType.AaveReserve,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	poolAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	underlyingTokenAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	decimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	suppliedBalance: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	suppliedBalanceUsd: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	supplyApy: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	isCollateral: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	borrowedBalance: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	borrowedBalanceUsd: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	borrowApy: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
})({
	selectors: {
		AccountPoolAddressUnderlyingTokenAddress: [
			'$account',
			'poolAddress',
			'underlyingTokenAddress',
		],
	},
})
