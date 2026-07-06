// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum Currency_TimestampSelector {
	CurrencyTimestampMs = 'CurrencyTimestampMs',
}
export default {
	entityType: EntityType.Currency_Timestamp,
	label: 'currency timestamp',
	labelPlural: 'currency observations',
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
			label: 'Currency',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Currency,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'marketCap',
			label: 'Market cap',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
