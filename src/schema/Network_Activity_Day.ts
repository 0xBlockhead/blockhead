// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { OptimisticProviderResult } from '$/schema/OptimisticProviderResult.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Network_Activity_Day,
	labels: {
		singular: 'network activity day',
		plural: 'network activity days',
	},
	description: 'A completed UTC day of provider-reported network activity aggregates.',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	dayStartTimestampMs: {
		label: 'Day start',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockCount: {
		label: 'Block count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SpaceAndTime_MakeInfinite,
		],
	},
	transactionCount: {
		label: 'Transaction count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SpaceAndTime_MakeInfinite,
		],
	},
	endBlockNumber: {
		label: 'End block number',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SpaceAndTime_MakeInfinite,
		],
	},
	indexedThroughTimestampMs: {
		label: 'Indexed through',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SpaceAndTime_MakeInfinite,
		],
	},
	resolvedAtMs: {
		label: 'Resolved at',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SpaceAndTime_MakeInfinite,
		],
	},
	trustModel: {
		label: 'Trust model',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(OptimisticProviderResult)),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SpaceAndTime_MakeInfinite,
		],
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
