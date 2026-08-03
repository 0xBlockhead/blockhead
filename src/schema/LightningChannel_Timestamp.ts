// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { LightningChannelStatus } from '$/schema/LightningChannelStatus.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const lightningMempoolSpaceRestLightningLndRestSources = [
	Source.LightningMempoolSpace_Rest,
	Source.LightningLnd_Rest,
] as const
const lightningMempoolSpaceRestSources = [
	Source.LightningMempoolSpace_Rest,
] as const

export default entity({
	entityType: EntityType.LightningChannel_Timestamp,
	labels: {
		singular: 'Lightning channel timestamp',
		plural: 'Lightning channel observations',
	},
})({
	$channel: {
		entityType: EntityType.LightningChannel,
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
		primitiveType: type.enumerated(...Object.values(LightningChannelStatus)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestLightningLndRestSources,
	},
	capacitySats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestLightningLndRestSources,
	},
	feeRatePpm: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	updatedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	closingTransactionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	closingFeeSats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	closingReason: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	closedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
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
