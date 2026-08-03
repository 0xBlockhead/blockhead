// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const constantsInternalSources = [
	Source.Constants_Internal,
] as const

export default entity({
	entityType: EntityType.Currency,
	labels: {
		singular: 'currency',
		plural: 'currencies',
	},
	description: 'A currency unit used for quoting values, balances, and market data.',
})({
	iso4217: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	minorUnitExponent: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	catalogSortWeight: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.Currency_Timestamp,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$marketsWithCurrencyAsBase: {
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: constantsInternalSources,
	},
	$$marketsWithCurrencyAsQuote: {
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: constantsInternalSources,
	},
})({
	selectors: {
		Iso4217: [
			'iso4217',
		],
	},
})
