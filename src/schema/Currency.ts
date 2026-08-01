// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	minorUnitExponent: {
		label: 'Minor unit exponent',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	catalogSortWeight: {
		label: 'Catalog sort weight',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		entityType: EntityType.Currency_Timestamp,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$marketsWithCurrencyAsBase: {
		label: 'Markets with currency as base',
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$marketsWithCurrencyAsQuote: {
		label: 'Markets with currency as quote',
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
