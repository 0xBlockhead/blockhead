// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'

export default entity({
	entityType: EntityType.AptosNetwork,
	labels: {
		singular: 'aptos network',
		plural: 'aptos networks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.AptosNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		entityType: EntityType.AptosBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		entityType: EntityType.AptosTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		entityType: EntityType.AptosAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$events: {
		entityType: EntityType.AptosEvent,
		cardinality: EntityFieldCardinality.Many,
	},
	$$coinBalanceTimestamps: {
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
