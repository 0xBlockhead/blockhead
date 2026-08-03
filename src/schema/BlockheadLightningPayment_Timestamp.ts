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
	entityType: EntityType.BlockheadLightningPayment_Timestamp,
	labels: {
		singular: 'Lightning payment timestamp',
		plural: 'Lightning payment observations',
	},
})({
	$payment: {
		entityType: EntityType.BlockheadLightningPayment,
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
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningLndRestSources,
	},
	feeMsat: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningLndRestSources,
	},
	failureReason: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningLndRestSources,
	},
	preimage: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningLndRestSources,
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
