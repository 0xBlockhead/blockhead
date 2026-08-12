// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadMoneroWalletState,
	labels: {
		singular: 'blockhead monero wallet state',
		plural: 'blockhead monero wallet states',
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
		entityType: EntityType.MoneroNetwork,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	primaryAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	viewOnly: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	trustedDaemon: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	viewKeyFingerprint: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	spendKeyAvailable: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	$$timestamps: {
		entityType: EntityType.BlockheadMoneroWalletState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	$$subaddresses: {
		entityType: EntityType.BlockheadMoneroSubaddressState,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	$$outputs: {
		entityType: EntityType.BlockheadMoneroOutputState,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	$$transfers: {
		entityType: EntityType.BlockheadMoneroTransferState,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
})({
	selectors: {
		WalletId: [
			'walletId',
		],
	},
})
