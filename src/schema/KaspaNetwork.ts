// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$blocks: {
		label: 'blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.KaspaBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.KaspaTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$acceptedTransactions: {
		label: 'accepted transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.KaspaAcceptedTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$addresses: {
		label: 'addresses',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.KaspaAddress,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.KaspaNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$virtualChainTimestamps: {
		label: 'virtual chain timestamps',
		type: EntityFieldType.EntitiesReference,
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
