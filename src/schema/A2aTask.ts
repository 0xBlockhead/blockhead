// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.A2aTask,
	labels: {
		singular: 'a2a task',
		plural: 'a2a tasks',
	},
})({
	taskId: {
		label: 'task ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$service: {
		label: 'service',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.A2aAgentService,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerTaskId: {
		label: 'provider task ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contextId: {
		label: 'context ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAt: {
		label: 'Updated',
		description: 'The time when the subject was last updated according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cancelledAt: {
		label: 'cancelled AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listed: {
		label: 'listed',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$events: {
		label: 'events',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.A2aTaskEvent,
		cardinality: EntityFieldCardinality.Many,
	},
	$$messages: {
		label: 'messages',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.A2aMessage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$artifacts: {
		label: 'artifacts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.A2aArtifact,
		cardinality: EntityFieldCardinality.Many,
	},
	$$pushNotificationConfigs: {
		label: 'push notification configs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.A2aPushNotificationConfig,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.A2aTask_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		TaskId: [
			'taskId',
		],
		ServiceProviderTaskId: [
			'$service',
			'providerTaskId',
		],
	},
})
