// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidVault,
	labels: {
		singular: 'hyperliquid vault',
		plural: 'hyperliquid vaults',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	vaultAddress: {
		label: 'vault address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$leader: {
		label: 'leader',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$equities: {
		label: 'equities',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidVaultEquity_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
