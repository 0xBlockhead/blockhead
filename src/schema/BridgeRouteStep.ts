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
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.BridgeRouteStep,

	label: 'Bridge Route Step',
	labelPlural: 'Bridge Route Steps',

	id: type({
		$route: BridgeRoute.id,
		index: 'number',
	}),

	fields: [
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
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$toNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$fromToken',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$toToken',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'railId',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BridgeRailId),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
		{
			name: 'settlementModel',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BridgeSettlementModel),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
		{
			name: 'verificationModel',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BridgeVerificationModel),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
		{
			name: 'assetOutcome',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BridgeAssetOutcome),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
