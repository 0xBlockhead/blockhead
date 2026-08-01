// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadLitecoinMwebWalletState,
	labels: {
		singular: 'blockhead litecoin mweb wallet state',
		plural: 'blockhead litecoin mweb wallet states',
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
	$$outputs: {
		label: 'outputs',
		entityType: EntityType.BlockheadLitecoinMwebOutputState,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadLitecoinMwebWalletState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		WalletIdNetwork: [
			'walletId',
			'$network',
		],
	},
})
