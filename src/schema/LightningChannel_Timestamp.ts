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
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
			Source.Amboss_Graphql,
		],
	},
	capacitySats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
			Source.Amboss_Graphql,
		],
	},
	feeRatePpm: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
			Source.Amboss_Graphql,
		],
	},
	updatedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
			Source.Amboss_Graphql,
		],
	},
	closingTransactionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Amboss_Graphql,
			Source.LightningMempoolSpace_Rest,
		],
	},
	closingFeeSats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Amboss_Graphql,
			Source.LightningMempoolSpace_Rest,
		],
	},
	closingReason: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Amboss_Graphql,
			Source.LightningMempoolSpace_Rest,
		],
	},
	closedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Amboss_Graphql,
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
