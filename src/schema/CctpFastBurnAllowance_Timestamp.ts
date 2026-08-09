// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CctpFastBurnAllowance_Timestamp,
	labels: {
		singular: 'CCTP fast burn allowance timestamp',
		plural: 'CCTP fast burn allowance observations',
	},
})({
	$allowance: {
		entityType: EntityType.CctpAllowance,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	allowanceUsdc: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	requestId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AllowanceTimestampMsSource: [
			'$allowance',
			'timestampMs',
			'source',
		],
	},
})
