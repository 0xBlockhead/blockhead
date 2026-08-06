// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CurveGauge,
	labels: {
		singular: 'Curve gauge',
		plural: 'Curve gauges',
	},
	description: 'A Curve liquidity gauge contract on an EIP-155 network, identified by gauge address (CRV emissions / LP staking surface for a pool).',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	gaugeAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$pool: {
		entityType: EntityType.CurvePool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	isKilled: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	hasNoCrv: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	relativeWeight: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	workingSupply: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	inflationRate: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	gaugeCrvApyMin: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
	gaugeCrvApyMax: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Curve_Rest,
		],
	},
})({
	selectors: {
		NetworkGaugeAddress: [
			'$network',
			'gaugeAddress',
		],
	},
})
