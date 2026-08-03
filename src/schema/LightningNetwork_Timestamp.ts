// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const lightningMempoolSpaceRestSources = [
	Source.LightningMempoolSpace_Rest,
] as const

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
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nodeCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	channelCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	totalCapacitySats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	torNodeCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	clearnetNodeCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	unannouncedNodeCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	averageCapacitySats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	medianCapacitySats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	averageFeeRatePpm: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
	},
	medianFeeRatePpm: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lightningMempoolSpaceRestSources,
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
