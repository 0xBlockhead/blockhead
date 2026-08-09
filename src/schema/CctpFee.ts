// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CctpFee,
	labels: {
		singular: 'CCTP fee',
		plural: 'CCTP fees',
	},
})({
	apiHost: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fromDomain: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	toDomain: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	rows: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		ApiHostFromDomainToDomain: [
			'apiHost',
			'fromDomain',
			'toDomain',
		],
	},
})
