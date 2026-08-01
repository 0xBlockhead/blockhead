// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.A2aMessage,
	labels: {
		singular: 'a2a message',
		plural: 'a2a messages',
	},
})({
	$task: {
		label: 'task',
		entityType: EntityType.A2aTask,
		cardinality: EntityFieldCardinality.One,
	},
	messageId: {
		label: 'message ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	role: {
		label: 'role',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
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
	$$parts: {
		label: 'parts',
		entityType: EntityType.A2aMessagePart,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		TaskMessageId: [
			'$task',
			'messageId',
		],
	},
})
