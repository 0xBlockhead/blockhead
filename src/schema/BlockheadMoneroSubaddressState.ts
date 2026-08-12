// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadMoneroSubaddressState,
	labels: {
		singular: 'blockhead monero subaddress state',
		plural: 'blockhead monero subaddress states',
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
	},
	accountIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	addressIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
	$$timestamps: {
		entityType: EntityType.BlockheadMoneroSubaddressState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MoneroWalletRpc_JsonRpc,
		],
	},
})({
	selectors: {
		WalletIdAccountIndexAddressIndex: [
			'walletId',
			'accountIndex',
			'addressIndex',
		],
	},
})
