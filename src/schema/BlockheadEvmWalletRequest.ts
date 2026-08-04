// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'

export default entity({
	entityType: EntityType.BlockheadEvmWalletRequest,
	labels: {
		singular: 'Blockhead EVM wallet request',
		plural: 'Blockhead EVM wallet requests',
	},
	description: 'EVM-specific network, simulation, and ordered call details for a network-neutral wallet request.',
})({
	$walletRequest: {
		entityType: EntityType.BlockheadWalletRequest,
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$simulation: {
		entityType: EntityType.BlockheadSessionSimulation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$calls: {
		entityType: EntityType.BlockheadWalletRequestCall,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmWalletRequest: [
			'$walletRequest',
		],
	},
})
