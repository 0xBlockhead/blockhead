// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CctpAllowance,
	labels: {
		singular: 'CCTP allowance',
		plural: 'CCTP allowances',
	},
})({
	token: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.CctpFastBurnAllowance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CircleCctpIris,
		],
	},
})({
	selectors: {
		Token: [
			'token',
		],
	},
})
