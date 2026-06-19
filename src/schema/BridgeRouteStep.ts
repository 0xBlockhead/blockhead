import { type } from 'arktype'
import {
	BridgeAssetOutcome,
	BridgeRailId,
	BridgeSettlementModel,
	BridgeVerificationModel,
} from '$/constants/Bridge.ts'
import BridgeRoute from '$/schema/BridgeRoute.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	NonNegativeInteger,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum BridgeRouteStepSelector {
	BridgeRouteIndex = 'bridgeRouteIndex',
}

export default {
	entityType: EntityType.BridgeRouteStep,

	label: 'Bridge Route Step',
	labelPlural: 'Bridge Route Steps',

	selectors: [
		{
			name: BridgeRouteStepSelector.BridgeRouteIndex,
			fields: [
				'$route',
				'index',
			],
		},
	],

	fields: [
		{
			name: '$route',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BridgeRoute,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'index',
			type: EntityFieldType.Primitive,
			primitiveType: NonNegativeInteger,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'stepType',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tool',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$fromNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: '$toNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: '$fromToken',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: '$toToken',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: 'railId',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BridgeRailId),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: 'settlementModel',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BridgeSettlementModel),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: 'verificationModel',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BridgeVerificationModel),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: 'assetOutcome',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BridgeAssetOutcome),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
