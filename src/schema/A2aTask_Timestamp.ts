// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum A2aTask_TimestampSelector {
	TaskTimestampMsSource = 'TaskTimestampMsSource',
}
export default {
	entityType: EntityType.A2aTask_Timestamp,
	label: 'a2a task timestamp',
	labelPlural: 'a2a task observations',
	selectors: [
		{
			name: A2aTask_TimestampSelector.TaskTimestampMsSource,
			fields: [
				'$task',
				'timestampMs',
				'source',
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
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'state',
			label: 'state',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'statusMessage',
			label: 'status message',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'error',
			label: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rawStatus',
			label: 'raw status',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
