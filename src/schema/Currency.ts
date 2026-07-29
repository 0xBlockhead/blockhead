// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Currency,
	labels: {
		singular: 'currency',
		plural: 'currencies',
	},
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
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$marketsWithCurrencyAsQuote: {
		label: 'Markets with currency as quote',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
})({
	selectors: {
		Iso4217: [
			'iso4217',
		],
	},
})
