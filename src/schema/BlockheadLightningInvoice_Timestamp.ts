// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const lightningLndRestSources = [
	Source.LightningLnd_Rest,
] as const

export default entity({
	entityType: EntityType.BlockheadLightningInvoice_Timestamp,
	labels: {
		singular: 'Lightning invoice timestamp',
		plural: 'Lightning invoice observations',
	},
})({
	$invoice: {
		entityType: EntityType.BlockheadLightningInvoice,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	state: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningLndRestSources,
	},
	amountPaidMsat: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningLndRestSources,
	},
	settledAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningLndRestSources,
	},
	settleIndex: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningLndRestSources,
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
