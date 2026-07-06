// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum A2aTaskSelector {
	TaskId = 'TaskId',
	ServiceProviderTaskId = 'ServiceProviderTaskId',
}
export default {
	entityType: EntityType.A2aTask,
	label: 'a2a task',
	labelPlural: 'a2a tasks',
	selectors: [
		{
			name: A2aTaskSelector.TaskId,
			fields: [
				'taskId',
			],
		},
		{
			name: A2aTaskSelector.ServiceProviderTaskId,
			fields: [
				'$service',
				'providerTaskId',
			],
		},
	],
	fields: [
		{
			name: 'taskId',
			label: 'task ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$service',
			label: 'service',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.A2aAgentService,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'providerTaskId',
			label: 'provider task ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
			name: 'updatedAt',
			label: 'Updated',
			description: 'The time when the subject was last updated according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'cancelledAt',
			label: 'cancelled AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'listed',
			label: 'listed',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$events',
			label: 'events',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.A2aTaskEvent,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$messages',
			label: 'messages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.A2aMessage,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$artifacts',
			label: 'artifacts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.A2aArtifact,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$pushNotificationConfigs',
			label: 'push notification configs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.A2aPushNotificationConfig,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.A2aTask_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
