// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadLightningInvoice_Timestamp,
	labels: {
		singular: 'Lightning invoice timestamp',
		plural: 'Lightning invoice observations',
	},
})({
	$invoice: {
		label: 'Invoice',
		entityType: EntityType.BlockheadLightningInvoice,
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
		label: 'State',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
	amountPaidMsat: {
		label: 'Amount paid msat',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
	settledAtMs: {
		label: 'Settled',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
	settleIndex: {
		label: 'Settle index',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
})({
	selectors: {
		InvoiceTimestampMsSource: [
			'$invoice',
			'timestampMs',
			'source',
		],
	},
})
