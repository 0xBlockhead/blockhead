// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonNftItemSelector {
	NetworkItemAddress = 'NetworkItemAddress',
	CollectionItemIndex = 'CollectionItemIndex',
}
export default {
	entityType: EntityType.TonNftItem,
	label: 'ton NFT item',
	labelPlural: 'ton NFT items',
	selectors: [
		{
			name: TonNftItemSelector.NetworkItemAddress,
			fields: [
				'$network',
				'itemAddress',
			],
		},
		{
			name: TonNftItemSelector.CollectionItemIndex,
			fields: [
				'$collection',
				'itemIndex',
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
			name: 'itemAddress',
			label: 'item address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$collection',
			label: 'collection',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonNftCollection,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'itemIndex',
			label: 'item index',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
			entityType: EntityType.TonNftItem_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
