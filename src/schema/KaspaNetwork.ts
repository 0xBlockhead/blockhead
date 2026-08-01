// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'

export default entity({
	entityType: EntityType.KaspaNetwork,
	labels: {
		singular: 'kaspa network',
		plural: 'kaspa networks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$blocks: {
		entityType: EntityType.KaspaBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		entityType: EntityType.KaspaTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$acceptedTransactions: {
		entityType: EntityType.KaspaAcceptedTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$addresses: {
		entityType: EntityType.KaspaAddress,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.KaspaNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$virtualChainTimestamps: {
		entityType: EntityType.KaspaVirtualChain_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
