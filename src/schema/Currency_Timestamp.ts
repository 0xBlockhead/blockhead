import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import Currency from '$/schema/Currency.ts'

export enum Currency_TimestampSelector {
	CurrencyTimestampMs = 'currencyTimestampMs',
}

export default {
	entityType: EntityType.Currency_Timestamp,

	label: 'Currency snapshot',
	labelPlural: 'Currency snapshots',

	selectors: [
		{
			name: Currency_TimestampSelector.CurrencyTimestampMs,
			fields: [
				'$currency',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$currency',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Currency,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'marketCap',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Constants_Internal],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
