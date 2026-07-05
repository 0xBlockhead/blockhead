// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadCashuMintQuote_TimestampSelector {
	MintQuoteTimestampMsSource = 'MintQuoteTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadCashuMintQuote_Timestamp,
	label: 'blockhead Cashu mint quote timestamp',
	labelPlural: 'blockhead Cashu mint quote observations',
	selectors: [
		{
			name: BlockheadCashuMintQuote_TimestampSelector.MintQuoteTimestampMsSource,
			fields: [
				'$mintQuote',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$mintQuote',
				label: 'mint quote',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadCashuMintQuote,
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
				name: 'subscriptionId',
				label: 'subscription ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
