// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { OptimisticProviderResult } from '$/schema/OptimisticProviderResult.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const spaceAndTimeMakeInfiniteSources = [
	Source.SpaceAndTime_MakeInfinite,
] as const

export default entity({
	entityType: EntityType.Network_Activity_Day,
	labels: {
		singular: 'network activity day',
		plural: 'network activity days',
	},
	description: 'A completed UTC day of provider-reported network activity aggregates.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	dayStartTimestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: spaceAndTimeMakeInfiniteSources,
	},
	transactionCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: spaceAndTimeMakeInfiniteSources,
	},
	endBlockNumber: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: spaceAndTimeMakeInfiniteSources,
	},
	indexedThroughTimestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: spaceAndTimeMakeInfiniteSources,
	},
	resolvedAtMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: spaceAndTimeMakeInfiniteSources,
	},
	trustModel: {
		primitiveType: type.enumerated(...Object.values(OptimisticProviderResult)),
		cardinality: EntityFieldCardinality.One,
		defaultSources: spaceAndTimeMakeInfiniteSources,
	},
})({
	selectors: {
		NetworkDayStartTimestampMsSource: [
			'$network',
			'dayStartTimestampMs',
			'source',
		],
	},
})
