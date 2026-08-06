// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CurvePoolCoin,
	labels: {
		singular: 'Curve pool coin',
		plural: 'Curve pool coins',
	},
	description: 'A coin leg inside a Curve pool (token address, decimals, balances / USD price from Curve REST).',
})({
	$pool: {
		entityType: EntityType.CurvePool,
		cardinality: EntityFieldCardinality.One,
	},
	coinAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	decimals: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	poolBalance: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	usdPrice: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	isBasePoolLpToken: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
})({
	selectors: {
		PoolCoinAddress: [
			'$pool',
			'coinAddress',
		],
	},
})
