// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonAccountSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.TonAccount,
	label: 'ton account',
	labelPlural: 'ton accounts',
	selectors: [
		{
			name: TonAccountSelector.NetworkAddress,
			fields: [
				'$network',
				'address',
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
				name: 'address',
				label: 'Address',
				description: 'The address or account identifier used by the source protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'workchain',
				label: 'workchain',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'addressHash',
				label: 'address hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$transactions',
				label: 'transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TonTransaction,
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
				name: '$jettonBalanceTimestamps',
				label: 'jetton balance timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TonJettonBalance_Timestamp,
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
				entityType: EntityType.TonAccount_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
