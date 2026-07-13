// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum A2aTask_TimestampSelector {
	TaskTimestampMsSource = 'TaskTimestampMsSource',
}
export const A2aTask_Timestamp = entity({
	entityType: EntityType.A2aTask_Timestamp,
	labels: {
		singular: 'a2a task timestamp',
		plural: 'a2a task observations',
	},
})({
	$task: {
		label: 'task',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.A2aTask,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	state: {
		label: 'state',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	statusMessage: {
		label: 'status message',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rawStatus: {
		label: 'raw status',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TaskTimestampMsSource: [
			'$task',
			'timestampMs',
			'source',
		],
	},
})
