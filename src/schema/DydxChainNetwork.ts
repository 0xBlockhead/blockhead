// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.DydxChainNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$markets: {
		entityType: EntityType.DydxChainMarket,
		cardinality: EntityFieldCardinality.Many,
	},
	$$subaccounts: {
		entityType: EntityType.DydxChainSubaccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$orders: {
		entityType: EntityType.DydxChainOrder,
		cardinality: EntityFieldCardinality.Many,
	},
	$$positions: {
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
