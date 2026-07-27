// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		entityType: EntityType.MoneroNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	primaryAddress: {
		label: 'primary address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	viewOnly: {
		label: 'view only',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	trustedDaemon: {
		label: 'trusted daemon',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	viewKeyFingerprint: {
		label: 'view key fingerprint',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spendKeyAvailable: {
		label: 'spend key available',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadMoneroWalletState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$subaddresses: {
		label: 'subaddresses',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadMoneroSubaddressState,
		cardinality: EntityFieldCardinality.Many,
	},
	$$outputs: {
		label: 'outputs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadMoneroOutputState,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transfers: {
		label: 'transfers',
		type: EntityFieldType.EntitiesReference,
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
