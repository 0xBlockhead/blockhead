// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadMoneroWalletState,
	labels: {
		singular: 'blockhead monero wallet state',
		plural: 'blockhead monero wallet states',
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
		entityType: EntityType.MoneroNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	primaryAddress: {
		label: 'primary address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	viewOnly: {
		label: 'view only',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	trustedDaemon: {
		label: 'trusted daemon',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	viewKeyFingerprint: {
		label: 'view key fingerprint',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spendKeyAvailable: {
		label: 'spend key available',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadMoneroWalletState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$subaddresses: {
		label: 'subaddresses',
		entityType: EntityType.BlockheadMoneroSubaddressState,
		cardinality: EntityFieldCardinality.Many,
	},
	$$outputs: {
		label: 'outputs',
		entityType: EntityType.BlockheadMoneroOutputState,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transfers: {
		label: 'transfers',
		entityType: EntityType.BlockheadMoneroTransferState,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		WalletId: [
			'walletId',
		],
	},
})
