// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum A2aTaskEventSelector {
	TaskSequence = 'TaskSequence',
}
export const A2aTaskEvent = entity({
	entityType: EntityType.A2aTaskEvent,
	labels: {
		singular: 'a2a task event',
		plural: 'a2a task events',
	},
})({
	$task: {
		label: 'task',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.A2aTask,
		cardinality: EntityFieldCardinality.One,
	},
	sequence: {
		label: 'sequence',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	eventKind: {
		label: 'event kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		label: 'state',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	final: {
		label: 'final',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$artifact: {
		label: 'artifact',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.A2aArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		label: 'payload',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TaskSequence: [
			'$task',
			'sequence',
		],
	},
})
