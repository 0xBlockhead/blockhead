import { type } from 'arktype'
import {
	BridgeAssetOutcome,
	BridgeRailId,
	BridgeSettlementModel,
	BridgeVerificationModel,
} from '$/constants/Bridge.ts'
import CoinInstance from '$/schema/CoinInstance.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.CoinBridgeCapability,

	label: 'Coin bridge capability',
	labelPlural: 'Coin bridge capabilities',

	id: type({
		$fromInstance: CoinInstance.id,
		$toInstance: CoinInstance.id,
		toolKey: 'string',
	}),

	fields: [
		{
			name: '$fromInstance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CoinInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$toInstance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CoinInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toolKey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
		{
			name: 'railId',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BridgeRailId),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
		{
			name: 'settlementModel',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BridgeSettlementModel),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
		{
			name: 'verificationModel',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BridgeVerificationModel),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
		{
			name: 'assetOutcome',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BridgeAssetOutcome),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
