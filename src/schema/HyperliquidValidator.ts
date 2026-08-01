// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidValidator,
	labels: {
		singular: 'hyperliquid validator',
		plural: 'hyperliquid validators',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	validator: {
		label: 'validator',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.HyperliquidValidator_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkValidator: [
			'$network',
			'validator',
		],
	},
})
