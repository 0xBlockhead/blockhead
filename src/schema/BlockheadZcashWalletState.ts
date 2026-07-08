// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadZcashWalletStateSelector {
	WalletId = 'WalletId',
}
export const BlockheadZcashWalletState = entity({
	entityType: EntityType.BlockheadZcashWalletState,
	label: 'blockhead zcash wallet state',
	labelPlural: 'blockhead zcash wallet states',
})({
	walletId: {
		label: 'wallet ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$wallet: {
		label: 'wallet',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	accountIndex: {
		label: 'account index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unifiedAddress: {
		label: 'unified address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transparentAddress: {
		label: 'transparent address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	saplingAddress: {
		label: 'sapling address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	orchardAddress: {
		label: 'orchard address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	birthdayHeight: {
		label: 'birthday height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadZcashWalletState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$viewingKeys: {
		label: 'viewing keys',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadZcashViewingKey,
		cardinality: EntityFieldCardinality.Many,
	},
	$$notes: {
		label: 'notes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadZcashNoteState,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		WalletId: [
			'walletId',
		],
	},
})
