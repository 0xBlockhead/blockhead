// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.DydxChainNetwork,
	labels: {
		singular: 'dydx chain network',
		plural: 'dydx chain networks',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.DydxChainNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$markets: {
		label: 'markets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.DydxChainMarket,
		cardinality: EntityFieldCardinality.Many,
	},
	$$subaccounts: {
		label: 'subaccounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.DydxChainSubaccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$orders: {
		label: 'orders',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.DydxChainOrder,
		cardinality: EntityFieldCardinality.Many,
	},
	$$positions: {
		label: 'positions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.DydxChainPerpetualPosition_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
