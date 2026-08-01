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
		label: 'wallet ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$wallet: {
		label: 'wallet',
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	accountIndex: {
		label: 'account index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unifiedAddress: {
		label: 'unified address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transparentAddress: {
		label: 'transparent address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	saplingAddress: {
		label: 'sapling address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	orchardAddress: {
		label: 'orchard address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	birthdayHeight: {
		label: 'birthday height',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadZcashWalletState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$viewingKeys: {
		label: 'viewing keys',
		entityType: EntityType.BlockheadZcashViewingKey,
		cardinality: EntityFieldCardinality.Many,
	},
	$$notes: {
		label: 'notes',
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
