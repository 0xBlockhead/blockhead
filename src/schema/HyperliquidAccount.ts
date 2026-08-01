// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountRole: {
		label: 'account role',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$masterAccount: {
		label: 'master account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$agentAccount: {
		label: 'agent account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$orders: {
		label: 'orders',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidOrder,
		cardinality: EntityFieldCardinality.Many,
	},
	$$fills: {
		label: 'fills',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidFill,
		cardinality: EntityFieldCardinality.Many,
	},
	$$vaultEquities: {
		label: 'vault equities',
		type: EntityFieldType.EntitiesReference,
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
