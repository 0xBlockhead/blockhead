// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum BridgeRouteTag {
	Best = 'BEST',
	Cheapest = 'CHEAPEST',
	Fastest = 'FASTEST',
	Recommended = 'RECOMMENDED',
}
export enum BridgeRouteSelector {
	Quote = 'Quote',
}
export const BridgeRoute = entity({
	entityType: EntityType.BridgeRoute,
	labels: {
		singular: 'bridge route',
		plural: 'bridge routes',
	},
})({
	fromChainId: {
		label: 'From chain ID',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	toChainId: {
		label: 'To chain ID',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	fromToken: {
		label: 'From token',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	toToken: {
		label: 'To token',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fromAmount: {
		label: 'From amount',
		type: EntityFieldType.Primitive,
		primitiveType: (type('bigint').narrow((value) => value >= 0n)),
		cardinality: EntityFieldCardinality.One,
	},
	fromAddress: {
		label: 'From address',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.One,
	},
	slippage: {
		label: 'Slippage',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	toAddress: {
		label: 'To address',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.One,
	},
	$$steps: {
		label: 'Steps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BridgeRouteStep,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Lifi_Rest,
		],
	},
	$fromNetwork: {
		label: 'From network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$toNetwork: {
		label: 'To network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	toAmount: {
		label: 'To amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	toAmountMin: {
		label: 'To amount min',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	estimatedCostUsd: {
		label: 'Estimated cost USD',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	estimatedDurationSeconds: {
		label: 'Estimated duration seconds',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	tags: {
		label: 'Tags',
		type: EntityFieldType.Primitive,
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
