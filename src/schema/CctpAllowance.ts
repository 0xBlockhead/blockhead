// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CctpAllowanceSelector {
	ApiHost = 'ApiHost',
}
export const CctpAllowance = entity({
	entityType: EntityType.CctpAllowance,
	labels: {
		singular: 'CCTP allowance',
		plural: 'CCTP allowances',
	},
})({
	apiHost: {
		label: 'API host',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	allowance: {
		label: 'Allowance',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fetchedAt: {
		label: 'Fetched at',
		type: EntityFieldType.Primitive,
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
