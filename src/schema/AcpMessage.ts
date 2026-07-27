// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AcpMessage,
	labels: {
		singular: 'acp message',
		plural: 'acp messages',
	},
})({
	$session: {
		label: 'session',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AcpSession,
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
		entityType: EntityType.AcpMessagePart,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SessionMessageId: [
			'$session',
			'messageId',
		],
	},
})
