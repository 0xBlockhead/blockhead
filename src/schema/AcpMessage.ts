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
		entityType: EntityType.AcpSession,
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
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$parts: {
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
