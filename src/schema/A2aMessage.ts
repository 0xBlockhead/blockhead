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
		entityType: EntityType.A2aTask,
		cardinality: EntityFieldCardinality.One,
	},
	messageId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	role: {
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
	$$parts: {
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
