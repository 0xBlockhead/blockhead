// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LightningNetwork_Timestamp,
	labels: {
		singular: 'Lightning network timestamp',
		plural: 'Lightning network observations',
	},
})({
	$lightningNetwork: {
		entityType: EntityType.LightningNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nodeCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
			Source.LightningMempoolSpace_Rest,
		],
	},
	channelCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
			Source.LightningMempoolSpace_Rest,
		],
	},
	totalCapacitySats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
			Source.LightningMempoolSpace_Rest,
		],
	},
	torNodeCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	clearnetNodeCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	unannouncedNodeCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	averageCapacitySats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
			Source.LightningMempoolSpace_Rest,
		],
	},
	medianCapacitySats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
			Source.LightningMempoolSpace_Rest,
		],
	},
	averageFeeRatePpm: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
	medianFeeRatePpm: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
		],
	},
})({
	selectors: {
		LightningNetworkTimestampMsSource: [
			'$lightningNetwork',
			'timestampMs',
			'source',
		],
	},
})
