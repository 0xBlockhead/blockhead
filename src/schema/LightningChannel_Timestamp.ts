// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { LightningChannelStatus } from '$/schema/LightningChannelStatus.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LightningChannel_Timestamp,
	labels: {
		singular: 'Lightning channel timestamp',
		plural: 'Lightning channel observations',
	},
})({
	$channel: {
		label: 'Channel',
		entityType: EntityType.LightningChannel,
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
		primitiveType: type.enumerated(...Object.values(LightningChannelStatus)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
	},
	capacitySats: {
		label: 'Capacity sats',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
	},
	feeRatePpm: {
		label: 'Fee rate ppm',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	updatedAtMs: {
		label: 'Updated',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	closingTransactionId: {
		label: 'Closing transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	closingFeeSats: {
		label: 'Closing fee sats',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	closingReason: {
		label: 'Closing reason',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	closedAtMs: {
		label: 'Closed',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
})({
	selectors: {
		ChannelTimestampMsSource: [
			'$channel',
			'timestampMs',
			'source',
		],
	},
})
