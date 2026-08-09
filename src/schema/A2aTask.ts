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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$service: {
		entityType: EntityType.A2aAgentService,
		cardinality: EntityFieldCardinality.One,
	},
	providerTaskId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contextId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cancelledAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listed: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$events: {
		entityType: EntityType.A2aTaskEvent,
		cardinality: EntityFieldCardinality.Many,
	},
	$$messages: {
		entityType: EntityType.A2aMessage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$artifacts: {
		entityType: EntityType.A2aArtifact,
		cardinality: EntityFieldCardinality.Many,
	},
	$$pushNotificationConfigs: {
		entityType: EntityType.A2aPushNotificationConfig,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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
