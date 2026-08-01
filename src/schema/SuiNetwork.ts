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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.SuiNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$checkpoints: {
		entityType: EntityType.SuiCheckpoint,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		entityType: EntityType.SuiTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		entityType: EntityType.SuiAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$objects: {
		entityType: EntityType.SuiObject,
		cardinality: EntityFieldCardinality.Many,
	},
	$$packages: {
		entityType: EntityType.SuiPackage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$coinTypes: {
		entityType: EntityType.SuiCoinType,
		cardinality: EntityFieldCardinality.Many,
	},
	$$coinBalanceTimestamps: {
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
