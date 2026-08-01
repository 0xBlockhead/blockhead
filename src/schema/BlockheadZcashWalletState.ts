// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadZcashWalletState,
	labels: {
		singular: 'blockhead zcash wallet state',
		plural: 'blockhead zcash wallet states',
	},
})({
	walletId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$wallet: {
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	accountIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unifiedAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transparentAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	saplingAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	orchardAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	birthdayHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.BlockheadZcashWalletState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$viewingKeys: {
		entityType: EntityType.BlockheadZcashViewingKey,
		cardinality: EntityFieldCardinality.Many,
	},
	$$notes: {
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
