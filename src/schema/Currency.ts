// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CurrencySelector {
	Iso4217 = 'Iso4217',
}
export const Currency = entity({
	entityType: EntityType.Currency,
	label: 'currency',
	labelPlural: 'currencies',
	description: 'A currency unit used for quoting values, balances, and market data.',
})({
	iso4217: {
		label: 'ISO code',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	minorUnitExponent: {
		label: 'Minor unit exponent',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	catalogSortWeight: {
		label: 'Catalog sort weight',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Currency_Timestamp,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$marketsWithCurrencyAsBase: {
		label: 'Markets with currency as base',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$marketsWithCurrencyAsQuote: {
		label: 'Markets with currency as quote',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
})({
	selectors: {
		Iso4217: [
			'iso4217',
		],
	},
})
