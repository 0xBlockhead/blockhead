// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.A2aTask,
		cardinality: EntityFieldCardinality.One,
	},
	messageId: {
		label: 'message ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	role: {
		label: 'role',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
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
	$$parts: {
		label: 'parts',
		type: EntityFieldType.EntitiesReference,
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
