// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadCashuMeltQuote_Timestamp,
	labels: {
		singular: 'blockhead Cashu melt quote timestamp',
		plural: 'blockhead Cashu melt quote observations',
	},
})({
	$meltQuote: {
		label: 'melt quote',
		entityType: EntityType.BlockheadCashuMeltQuote,
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
	paymentPreimage: {
		label: 'payment preimage',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subscriptionId: {
		label: 'subscription ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		MeltQuoteTimestampMsSource: [
			'$meltQuote',
			'timestampMs',
			'source',
		],
	},
})
