// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiNetwork,
	labels: {
		singular: 'sui network',
		plural: 'sui networks',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.SuiNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$checkpoints: {
		label: 'checkpoints',
		entityType: EntityType.SuiCheckpoint,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.SuiTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		label: 'accounts',
		entityType: EntityType.SuiAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$objects: {
		label: 'objects',
		entityType: EntityType.SuiObject,
		cardinality: EntityFieldCardinality.Many,
	},
	$$packages: {
		label: 'packages',
		entityType: EntityType.SuiPackage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$coinTypes: {
		label: 'coin types',
		entityType: EntityType.SuiCoinType,
		cardinality: EntityFieldCardinality.Many,
	},
	$$coinBalanceTimestamps: {
		label: 'coin balance timestamps',
		entityType: EntityType.SuiCoinBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
