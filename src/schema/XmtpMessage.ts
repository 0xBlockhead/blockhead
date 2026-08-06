// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XmtpMessage,
	labels: {
		singular: 'XMTP message',
		plural: 'XMTP messages',
	},
})({
	id: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$conversation: {
		entityType: EntityType.XmtpConversation,
		cardinality: EntityFieldCardinality.One,
	},
	senderInboxId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sentAtNs: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentText: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Id: [
			'id',
		],
		ConversationMessageId: [
			'$conversation',
			'id',
		],
	},
})
