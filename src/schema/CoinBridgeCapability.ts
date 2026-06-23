import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CoinBridgeCapabilitySelector {
	EvmCoinInstanceEvmCoinInstanceToolKey = 'evmCoinInstanceEvmCoinInstanceToolKey',
	FromInstanceToInstanceToolKey = '$fromInstance+$toInstance+toolKey',
}
export default {
	entityType: EntityType.CoinBridgeCapability,
	label: 'coin bridge capability',
	labelPlural: 'coin bridge capabilities',
	selectors: [
		{
			name: CoinBridgeCapabilitySelector.EvmCoinInstanceEvmCoinInstanceToolKey,
			fields: [
				'$fromInstance',
				'$toInstance',
				'toolKey',
			],
		},
	],
	fields: [
		{
			name: '$fromInstance',
			label: 'from instance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$toInstance',
			label: 'to instance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toolKey',
			label: 'tool key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'railId',
			label: 'rail ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'settlementModel',
			label: 'settlement model',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'verificationModel',
			label: 'verification model',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'assetOutcome',
			label: 'asset outcome',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
