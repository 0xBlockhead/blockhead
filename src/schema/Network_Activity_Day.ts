// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum OptimisticProviderResult {
	OptimisticProviderResult = 'OptimisticProviderResult',
}
export enum Network_Activity_DaySelector {
	NetworkDayStartTimestampMsSource = 'NetworkDayStartTimestampMsSource',
}
export const Network_Activity_Day = entity({
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
		primitiveType: (type('number.integer >= 0')),
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
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SpaceAndTime_MakeInfinite,
		],
	},
	resolvedAtMs: {
		label: 'Resolved at',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
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
