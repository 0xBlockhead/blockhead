// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CurvePool,
	labels: {
		singular: 'Curve pool',
		plural: 'Curve pools',
	},
	description: 'A Curve Finance liquidity pool on an EIP-155 network, identified by its pool contract address (protocol-native; not a generic LiquidityPool).',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	poolAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	registryId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	lpTokenAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	virtualPrice: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	amplificationCoefficient: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	totalSupply: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	usdTotal: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	isMetaPool: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	$gauge: {
		entityType: EntityType.CurveGauge,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	assetTypeName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	creationBlockNumber: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	creationTimestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	$$coins: {
		entityType: EntityType.CurvePoolCoin,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
})({
	selectors: {
		NetworkPoolAddress: [
			'$network',
			'poolAddress',
		],
	},
})
