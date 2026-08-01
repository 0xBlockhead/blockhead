// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.DydxChainSubaccount,
	labels: {
		singular: 'dydx chain subaccount',
		plural: 'dydx chain subaccounts',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.DydxChainNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'account',
		entityType: EntityType.CosmosAccount,
		cardinality: EntityFieldCardinality.One,
	},
	subaccountNumber: {
		label: 'subaccount number',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$positions: {
		label: 'positions',
		entityType: EntityType.DydxChainPerpetualPosition_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$orders: {
		label: 'orders',
		entityType: EntityType.DydxChainOrder,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.DydxChainSubaccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAccountSubaccountNumber: [
			'$network',
			'$account',
			'subaccountNumber',
		],
	},
})
