// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CctpFeeSelector {
	ApiHostFromDomainToDomain = 'ApiHostFromDomainToDomain',
}
export const CctpFee = entity({
	entityType: EntityType.CctpFee,
	labels: {
		singular: 'CCTP fee',
		plural: 'CCTP fees',
	},
})({
	apiHost: {
		label: 'API host',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fromDomain: {
		label: 'From domain',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	toDomain: {
		label: 'To domain',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	rows: {
		label: 'Rows',
		type: EntityFieldType.Primitive,
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
