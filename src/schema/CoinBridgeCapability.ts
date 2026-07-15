// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CoinBridgeCapabilitySelector {
	EvmCoinInstanceEvmCoinInstanceToolKey = 'EvmCoinInstanceEvmCoinInstanceToolKey',
}
export const CoinBridgeCapability = entity({
	entityType: EntityType.CoinBridgeCapability,
	labels: {
		singular: 'Coin bridge capability',
		plural: 'coin bridge capabilities',
	},
	description: 'A supported bridge path between two EVM coin instances through a specific bridge tool.',
})({
	$fromInstance: {
		label: 'From instance',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.One,
	},
	$toInstance: {
		label: 'To instance',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.One,
	},
	toolKey: {
		label: 'Tool key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	railId: {
		label: 'Rail ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	settlementModel: {
		label: 'Settlement model',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	verificationModel: {
		label: 'Verification model',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetOutcome: {
		label: 'Asset outcome',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		EvmCoinInstanceEvmCoinInstanceToolKey: [
			'$fromInstance',
			'$toInstance',
			'toolKey',
		],
	},
})
