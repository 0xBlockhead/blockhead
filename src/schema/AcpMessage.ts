// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.AcpSession,
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
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$parts: {
		label: 'parts',
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
