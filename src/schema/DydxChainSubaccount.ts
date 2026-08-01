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
		entityType: EntityType.DydxChainNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		entityType: EntityType.CosmosAccount,
		cardinality: EntityFieldCardinality.One,
	},
	subaccountNumber: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$positions: {
		entityType: EntityType.DydxChainPerpetualPosition_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$orders: {
		entityType: EntityType.DydxChainOrder,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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
