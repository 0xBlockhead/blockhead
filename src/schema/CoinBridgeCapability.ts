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
		label: 'From instance',
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.One,
	},
	$toInstance: {
		label: 'To instance',
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.One,
	},
	toolKey: {
		label: 'Tool key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	railId: {
		label: 'Rail ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	settlementModel: {
		label: 'Settlement model',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	verificationModel: {
		label: 'Verification model',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetOutcome: {
		label: 'Asset outcome',
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
