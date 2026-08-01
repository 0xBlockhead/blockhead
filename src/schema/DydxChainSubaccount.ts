// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.DydxChainNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CosmosAccount,
		cardinality: EntityFieldCardinality.One,
	},
	subaccountNumber: {
		label: 'subaccount number',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$positions: {
		label: 'positions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.DydxChainPerpetualPosition_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$orders: {
		label: 'orders',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.DydxChainOrder,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
