// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonNetworkSelector {
	Network = 'Network',
}
export const TonNetwork = entity({
	entityType: EntityType.TonNetwork,
	labels: {
		singular: 'ton network',
		plural: 'ton networks',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$workchains: {
		label: 'workchains',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonWorkchain,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		label: 'blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		label: 'accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$contracts: {
		label: 'contracts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonContract,
		cardinality: EntityFieldCardinality.Many,
	},
	$$messages: {
		label: 'messages',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonMessage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$traces: {
		label: 'traces',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonTrace,
		cardinality: EntityFieldCardinality.Many,
	},
	$$jettons: {
		label: 'jettons',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonJetton,
		cardinality: EntityFieldCardinality.Many,
	},
	$$nftCollections: {
		label: 'NFT collections',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonNftCollection,
		cardinality: EntityFieldCardinality.Many,
	},
	$$nftItems: {
		label: 'NFT items',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonNftItem,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
