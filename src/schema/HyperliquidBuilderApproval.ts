// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'

export default entity({
	entityType: EntityType.HyperliquidBuilderApproval,
	labels: {
		singular: 'hyperliquid builder approval',
		plural: 'hyperliquid builder approvals',
	},
})({
	$account: {
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.One,
	},
	builder: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		AccountBuilder: [
			'$account',
			'builder',
		],
	},
})
