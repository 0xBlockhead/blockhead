// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resultLimit: {
		label: 'result limit',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$matchingNames: {
		label: 'matching names',
		type: EntityFieldType.EntitiesReference,
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
