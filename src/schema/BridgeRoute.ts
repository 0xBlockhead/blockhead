// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { BridgeRouteTag } from '$/schema/BridgeRouteTag.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BridgeRoute,
	labels: {
		singular: 'bridge route',
		plural: 'bridge routes',
	},
})({
	fromChainId: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	toChainId: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	fromToken: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	toToken: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fromAmount: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	fromAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	slippage: {
		primitiveType: type('number >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	toAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$$steps: {
		entityType: EntityType.BridgeRouteStep,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Lifi_Rest,
		],
	},
	$fromNetwork: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$toNetwork: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	toAmount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	toAmountMin: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	estimatedCostUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	estimatedDurationSeconds: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	tags: {
		primitiveType: type.enumerated(...Object.values(BridgeRouteTag)).array(),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		Quote: [
			'fromChainId',
			'toChainId',
			'fromToken',
			'toToken',
			'fromAmount',
			'fromAddress',
			'slippage',
			'toAddress',
		],
	},
})
