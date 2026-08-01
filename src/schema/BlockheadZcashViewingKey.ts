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
	keyFingerprint: {
		label: 'key fingerprint',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	keyKind: {
		label: 'key kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	pools: {
		label: 'pools',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	accountIndex: {
		label: 'account index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	birthdayHeight: {
		label: 'birthday height',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	canViewIncoming: {
		label: 'can view incoming',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	canViewOutgoing: {
		label: 'can view outgoing',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	canSpend: {
		label: 'can spend',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	importedAt: {
		label: 'imported AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	viewingKeyMaterial: {
		label: 'viewing key material',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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
