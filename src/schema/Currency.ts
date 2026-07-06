// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CurrencySelector {
	Iso4217 = 'Iso4217',
}
export default {
	entityType: EntityType.Currency,
	label: 'currency',
	labelPlural: 'currencies',
	description: 'A currency unit used for quoting values, balances, and market data.',
	selectors: [
		{
			name: CurrencySelector.Iso4217,
			fields: [
				'iso4217',
			],
		},
	],
	fields: [
		{
			name: 'iso4217',
			label: 'ISO code',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'symbol',
			label: 'Symbol',
			description: 'The short ticker or symbol used for display.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'minorUnitExponent',
			label: 'Minor unit exponent',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'catalogSortWeight',
			label: 'Catalog sort weight',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Currency_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$marketsWithCurrencyAsBase',
			label: 'Markets with currency as base',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$marketsWithCurrencyAsQuote',
			label: 'Markets with currency as quote',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	],
} as const satisfies EntityDefinition
