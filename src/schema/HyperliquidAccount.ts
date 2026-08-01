// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidAccount,
	labels: {
		singular: 'hyperliquid account',
		plural: 'hyperliquid accounts',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountRole: {
		label: 'account role',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$masterAccount: {
		label: 'master account',
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$agentAccount: {
		label: 'agent account',
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.HyperliquidAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$orders: {
		label: 'orders',
		entityType: EntityType.HyperliquidOrder,
		cardinality: EntityFieldCardinality.Many,
	},
	$$fills: {
		label: 'fills',
		entityType: EntityType.HyperliquidFill,
		cardinality: EntityFieldCardinality.Many,
	},
	$$vaultEquities: {
		label: 'vault equities',
		entityType: EntityType.HyperliquidVaultEquity_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})
