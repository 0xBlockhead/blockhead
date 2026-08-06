// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidAccount,
	labels: {
		singular: 'hyperliquid account',
		plural: 'hyperliquid accounts',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountRole: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$masterAccount: {
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$agentAccount: {
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.HyperliquidAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$orders: {
		entityType: EntityType.HyperliquidOrder,
		cardinality: EntityFieldCardinality.Many,
	},
	$$fills: {
		entityType: EntityType.HyperliquidFill,
		cardinality: EntityFieldCardinality.Many,
	},
	$$vaultEquities: {
		entityType: EntityType.HyperliquidVaultEquity_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$borrowLendPositions: {
		entityType: EntityType.HyperliquidBorrowLendPosition,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})
