// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CoinBridgeCapabilitySelector {
	EvmCoinInstanceEvmCoinInstanceToolKey = 'EvmCoinInstanceEvmCoinInstanceToolKey',
}
export default {
	entityType: EntityType.CoinBridgeCapability,
	label: 'Coin bridge capability',
	labelPlural: 'coin bridge capabilities',
	description: 'A supported bridge path between two EVM coin instances through a specific bridge tool.',
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
				label: 'From instance',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$toInstance',
				label: 'To instance',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'toolKey',
				label: 'Tool key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'railId',
				label: 'Rail ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'settlementModel',
				label: 'Settlement model',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'verificationModel',
				label: 'Verification model',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'assetOutcome',
				label: 'Asset outcome',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
