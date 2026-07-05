// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum A2aMessageSelector {
	TaskMessageId = 'TaskMessageId',
}
export default {
	entityType: EntityType.A2aMessage,
	label: 'a2a message',
	labelPlural: 'a2a messages',
	selectors: [
		{
			name: A2aMessageSelector.TaskMessageId,
			fields: [
				'$task',
				'messageId',
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
				name: 'messageId',
				label: 'message ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'role',
				label: 'role',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'contextId',
				label: 'context ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'createdAt',
				label: 'Created',
				description: 'The time when the subject was created according to the source.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$parts',
				label: 'parts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.A2aMessagePart,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
