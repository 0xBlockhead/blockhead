// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadEnsNameSearch,
	labels: {
		singular: 'blockhead ENS name search',
		plural: 'blockhead ENS name searches',
	},
})({
	query: {
		label: 'Query',
		description: 'ENSIP-15-normalized substring search text keyed in the selector for shareable `/ens?query=` URLs.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resultLimit: {
		label: 'result limit',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$matchingNames: {
		label: 'matching names',
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Query: [
			'query',
		],
	},
})
