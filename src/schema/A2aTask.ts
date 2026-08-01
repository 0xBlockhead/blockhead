// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$service: {
		label: 'service',
		entityType: EntityType.A2aAgentService,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerTaskId: {
		label: 'provider task ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contextId: {
		label: 'context ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAt: {
		label: 'Updated',
		description: 'The time when the subject was last updated according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cancelledAt: {
		label: 'cancelled AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listed: {
		label: 'listed',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$events: {
		label: 'events',
		entityType: EntityType.A2aTaskEvent,
		cardinality: EntityFieldCardinality.Many,
	},
	$$messages: {
		label: 'messages',
		entityType: EntityType.A2aMessage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$artifacts: {
		label: 'artifacts',
		entityType: EntityType.A2aArtifact,
		cardinality: EntityFieldCardinality.Many,
	},
	$$pushNotificationConfigs: {
		label: 'push notification configs',
		entityType: EntityType.A2aPushNotificationConfig,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
