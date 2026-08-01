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
		label: 'API host',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fromDomain: {
		label: 'From domain',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	toDomain: {
		label: 'To domain',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	rows: {
		label: 'Rows',
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
