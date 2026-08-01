// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadCashuMintQuote_Timestamp,
	labels: {
		singular: 'blockhead Cashu mint quote timestamp',
		plural: 'blockhead Cashu mint quote observations',
	},
})({
	$mintQuote: {
		label: 'mint quote',
		entityType: EntityType.BlockheadCashuMintQuote,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	state: {
		label: 'state',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	expiryMs: {
		label: 'expiry ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subscriptionId: {
		label: 'subscription ID',
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
