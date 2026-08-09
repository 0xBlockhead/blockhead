// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'

export default entity({
	entityType: EntityType.HyperliquidVault,
	labels: {
		singular: 'hyperliquid vault',
		plural: 'hyperliquid vaults',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	vaultAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$leader: {
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$equities: {
		entityType: EntityType.HyperliquidVaultEquity_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.HyperliquidVault_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkVaultAddress: [
			'$network',
			'vaultAddress',
		],
	},
})
