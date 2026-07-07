// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonNftCollectionSelector {
	NetworkCollectionAddress = 'NetworkCollectionAddress',
}
export default {
	entityType: EntityType.TonNftCollection,
	label: 'ton NFT collection',
	labelPlural: 'ton NFT collections',
	selectors: [
		{
			name: TonNftCollectionSelector.NetworkCollectionAddress,
			fields: [
				'$network',
				'collectionAddress',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'collectionAddress',
			label: 'collection address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$items',
			label: 'items',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonNftItem,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transfers',
			label: 'transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonNftTransfer,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonNftCollection_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
