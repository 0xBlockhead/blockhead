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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resultLimit: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$matchingNames: {
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
