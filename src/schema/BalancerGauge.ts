// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BalancerGauge,
	labels: {
		singular: 'Balancer gauge',
		plural: 'Balancer gauges',
	},
	description: 'A Balancer liquidity gauge contract on an EIP-155 network (pool staking / veBAL voting surface).',
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
		entityType: EntityType.BalancerPool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	version: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	isKilled: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	relativeWeightCap: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	poolSymbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	poolType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	protocolVersion: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Balancer_Rest,
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
