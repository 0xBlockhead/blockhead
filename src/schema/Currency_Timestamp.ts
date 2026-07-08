// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum Currency_TimestampSelector {
	CurrencyTimestampMs = 'CurrencyTimestampMs',
}
export const Currency_Timestamp = entity({
	entityType: EntityType.Currency_Timestamp,
	label: 'currency timestamp',
	labelPlural: 'currency observations',
})({
	$currency: {
		label: 'Currency',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Currency,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	marketCap: {
		label: 'Market cap',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		CurrencyTimestampMs: [
			'$currency',
			'timestampMs',
		],
	},
})
