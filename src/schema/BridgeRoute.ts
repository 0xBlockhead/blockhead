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
		label: 'From chain ID',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	toChainId: {
		label: 'To chain ID',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	fromToken: {
		label: 'From token',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	toToken: {
		label: 'To token',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fromAmount: {
		label: 'From amount',
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	fromAddress: {
		label: 'From address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	slippage: {
		label: 'Slippage',
		primitiveType: type('number >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	toAddress: {
		label: 'To address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$$steps: {
		label: 'Steps',
		entityType: EntityType.BridgeRouteStep,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Lifi_Rest,
		],
	},
	$fromNetwork: {
		label: 'From network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$toNetwork: {
		label: 'To network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	toAmount: {
		label: 'To amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	toAmountMin: {
		label: 'To amount min',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	estimatedCostUsd: {
		label: 'Estimated cost USD',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	estimatedDurationSeconds: {
		label: 'Estimated duration seconds',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	tags: {
		label: 'Tags',
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
