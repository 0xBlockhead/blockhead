// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AptosNetwork,
	labels: {
		singular: 'aptos network',
		plural: 'aptos networks',
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
		entityType: EntityType.AptosNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		label: 'blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AptosBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AptosTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		label: 'accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AptosAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$events: {
		label: 'events',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AptosEvent,
		cardinality: EntityFieldCardinality.Many,
	},
	$$coinBalanceTimestamps: {
		label: 'coin balance timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AptosCoinBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
