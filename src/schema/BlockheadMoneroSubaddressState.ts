// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadMoneroSubaddressStateSelector {
	WalletIdAccountIndexAddressIndex = 'WalletIdAccountIndexAddressIndex',
}
export default {
	entityType: EntityType.BlockheadMoneroSubaddressState,
	label: 'blockhead monero subaddress state',
	labelPlural: 'blockhead monero subaddress states',
	selectors: [
		{
			name: BlockheadMoneroSubaddressStateSelector.WalletIdAccountIndexAddressIndex,
			fields: [
				'walletId',
				'accountIndex',
				'addressIndex',
			],
		},
	],
	fields: [
		{
				name: 'walletId',
				label: 'wallet ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$wallet',
				label: 'wallet',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadWallet,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.MoneroNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'accountIndex',
				label: 'account index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'addressIndex',
				label: 'address index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'address',
				label: 'Address',
				description: 'The address or account identifier used by the source protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'label',
				label: 'Label',
				description: 'A human-readable name for the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadMoneroSubaddressState_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
