// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadZcashWalletStateSelector {
	WalletId = 'WalletId',
}
export default {
	entityType: EntityType.BlockheadZcashWalletState,
	label: 'blockhead zcash wallet state',
	labelPlural: 'blockhead zcash wallet states',
	selectors: [
		{
			name: BlockheadZcashWalletStateSelector.WalletId,
			fields: [
				'walletId',
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
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'accountIndex',
				label: 'account index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'unifiedAddress',
				label: 'unified address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transparentAddress',
				label: 'transparent address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'saplingAddress',
				label: 'sapling address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'orchardAddress',
				label: 'orchard address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'birthdayHeight',
				label: 'birthday height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadZcashWalletState_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$viewingKeys',
				label: 'viewing keys',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadZcashViewingKey,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$notes',
				label: 'notes',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadZcashNoteState,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
