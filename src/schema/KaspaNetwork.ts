// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.KaspaNetwork,
	labels: {
		singular: 'kaspa network',
		plural: 'kaspa networks',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$blocks: {
		label: 'blocks',
		entityType: EntityType.KaspaBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.KaspaTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$acceptedTransactions: {
		label: 'accepted transactions',
		entityType: EntityType.KaspaAcceptedTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$addresses: {
		label: 'addresses',
		entityType: EntityType.KaspaAddress,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.KaspaNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$virtualChainTimestamps: {
		label: 'virtual chain timestamps',
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
