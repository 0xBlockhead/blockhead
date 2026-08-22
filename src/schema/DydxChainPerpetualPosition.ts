// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'

export default entity({
	entityType: EntityType.DydxChainPerpetualPosition,
	labels: {
		singular: 'dydx chain open perpetual position',
		plural: 'dydx chain open perpetual positions',
	},
})({
	$subaccount: {
		entityType: EntityType.DydxChainSubaccount,
		cardinality: EntityFieldCardinality.One,
	},
	$market: {
		entityType: EntityType.DydxChainMarket,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.DydxChainPerpetualPosition_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SubaccountMarket: [
			'$subaccount',
			'$market',
		],
	},
})
