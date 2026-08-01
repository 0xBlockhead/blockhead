// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadLightningPayment_Timestamp,
	labels: {
		singular: 'Lightning payment timestamp',
		plural: 'Lightning payment observations',
	},
})({
	$payment: {
		label: 'Payment',
		entityType: EntityType.BlockheadLightningPayment,
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
	status: {
		label: 'Status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
	feeMsat: {
		label: 'Fee msat',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
	failureReason: {
		label: 'Failure reason',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
	preimage: {
		label: 'Preimage',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
})({
	selectors: {
		PaymentTimestampMsSource: [
			'$payment',
			'timestampMs',
			'source',
		],
	},
})
