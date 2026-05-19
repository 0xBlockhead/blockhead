import { type } from 'arktype'
import { Iso4217 } from '$/constants/Currency.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { marketCatalogFieldSources } from '$/constants/Market.ts'
import { Source } from '$/sources/$Source.ts'


export default {
	entityType: EntityType.Currency,

	label: 'Currency',
	labelPlural: 'Currencies',

	id: type({
		iso4217: type.valueOf(Iso4217),
	}),

	fields: [
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [Source.Constants_Internal],
		},
		{
			name: 'symbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Constants_Internal],
		},
		{
			name: 'minorUnitExponent',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [Source.Constants_Internal],
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Currency_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Constants_Internal],
		},
		{
			name: '$$marketsWithCurrencyAsBase',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [...marketCatalogFieldSources],
		},
		{
			name: '$$marketsWithCurrencyAsQuote',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [...marketCatalogFieldSources],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
