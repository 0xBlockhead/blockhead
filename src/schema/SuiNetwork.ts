// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$checkpoints: {
		label: 'checkpoints',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiCheckpoint,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		label: 'accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$objects: {
		label: 'objects',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiObject,
		cardinality: EntityFieldCardinality.Many,
	},
	$$packages: {
		label: 'packages',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiPackage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$coinTypes: {
		label: 'coin types',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiCoinType,
		cardinality: EntityFieldCardinality.Many,
	},
	$$coinBalanceTimestamps: {
		label: 'coin balance timestamps',
		type: EntityFieldType.EntitiesReference,
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
