// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CctpAllowance,
	labels: {
		singular: 'CCTP allowance',
		plural: 'CCTP allowances',
	},
})({
	apiHost: {
		label: 'API host',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	allowance: {
		label: 'Allowance',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fetchedAt: {
		label: 'Fetched at',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		ApiHost: [
			'apiHost',
		],
	},
})
