// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadCashuMeltQuote_TimestampSelector {
	MeltQuoteTimestampMsSource = 'MeltQuoteTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadCashuMeltQuote_Timestamp,
	label: 'blockhead Cashu melt quote timestamp',
	labelPlural: 'blockhead Cashu melt quote observations',
	selectors: [
		{
			name: BlockheadCashuMeltQuote_TimestampSelector.MeltQuoteTimestampMsSource,
			fields: [
				'$meltQuote',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$meltQuote',
			label: 'melt quote',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadCashuMeltQuote,
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
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'state',
			label: 'state',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'expiryMs',
			label: 'expiry ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'paymentPreimage',
			label: 'payment preimage',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'subscriptionId',
			label: 'subscription ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
