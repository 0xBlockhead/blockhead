// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BridgeRouteStepSelector {
	RouteIndexInRoute = 'RouteIndexInRoute',
}
export default {
	entityType: EntityType.BridgeRouteStep,
	label: 'bridge route step',
	labelPlural: 'bridge route steps',
	selectors: [
		{
			name: BridgeRouteStepSelector.RouteIndexInRoute,
			fields: [
				'$route',
				'indexInRoute',
			],
		},
	],
	fields: [
		{
			name: '$route',
			label: 'Route',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BridgeRoute,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'indexInRoute',
			label: 'Index in route',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'stepType',
			label: 'Step type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tool',
			label: 'Tool',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$fromNetwork',
			label: 'From network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$toNetwork',
			label: 'To network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$fromToken',
			label: 'From token',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$toToken',
			label: 'To token',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'railId',
			label: 'Rail ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'settlementModel',
			label: 'Settlement model',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verificationModel',
			label: 'Verification model',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'assetOutcome',
			label: 'Asset outcome',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
