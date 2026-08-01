// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadZcashViewingKey,
	labels: {
		singular: 'blockhead zcash viewing key',
		plural: 'blockhead zcash viewing keys',
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
	keyFingerprint: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	keyKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	pools: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	accountIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	birthdayHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	canViewIncoming: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	canViewOutgoing: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	canSpend: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	importedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	viewingKeyMaterial: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.BlockheadZcashViewingKey_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		WalletIdKeyFingerprint: [
			'walletId',
			'keyFingerprint',
		],
	},
})
