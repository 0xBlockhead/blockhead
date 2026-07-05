// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum A2aTaskEventSelector {
	TaskSequence = 'TaskSequence',
}
export default {
	entityType: EntityType.A2aTaskEvent,
	label: 'a2a task event',
	labelPlural: 'a2a task events',
	selectors: [
		{
			name: A2aTaskEventSelector.TaskSequence,
			fields: [
				'$task',
				'sequence',
			],
		},
	],
	fields: [
		{
				name: '$task',
				label: 'task',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.A2aTask,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'sequence',
				label: 'sequence',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'eventKind',
				label: 'event kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'state',
				label: 'state',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'final',
				label: 'final',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$artifact',
				label: 'artifact',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.A2aArtifact,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'payload',
				label: 'payload',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
