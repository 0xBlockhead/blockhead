// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadCashuMintQuote_TimestampSelector {
	MintQuoteTimestampMsSource = 'MintQuoteTimestampMsSource',
}
export const BlockheadCashuMintQuote_Timestamp = entity({
	entityType: EntityType.BlockheadCashuMintQuote_Timestamp,
	label: 'blockhead Cashu mint quote timestamp',
	labelPlural: 'blockhead Cashu mint quote observations',
})({
	$mintQuote: {
		label: 'mint quote',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadCashuMintQuote,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	state: {
		label: 'state',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	expiryMs: {
		label: 'expiry ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subscriptionId: {
		label: 'subscription ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		MintQuoteTimestampMsSource: [
			'$mintQuote',
			'timestampMs',
			'source',
		],
	},
})
