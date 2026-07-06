// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.TonNetwork,
	label: 'ton network',
	labelPlural: 'ton networks',
	selectors: [
		{
			name: TonNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$workchains',
			label: 'workchains',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonWorkchain,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$accounts',
			label: 'accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$contracts',
			label: 'contracts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonContract,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$messages',
			label: 'messages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonMessage,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$traces',
			label: 'traces',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonTrace,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$jettons',
			label: 'jettons',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonJetton,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$nftCollections',
			label: 'NFT collections',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonNftCollection,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$nftItems',
			label: 'NFT items',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonNftItem,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
