// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CoinBridgeCapability,
	labels: {
		singular: 'Coin bridge capability',
		plural: 'coin bridge capabilities',
	},
	description: 'A supported bridge path between two EVM coin instances through a specific bridge tool.',
})({
	$fromInstance: {
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.One,
	},
	$toInstance: {
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.One,
	},
	toolKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	railId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	settlementModel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	verificationModel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetOutcome: {
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
