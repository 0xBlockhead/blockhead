// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XmtpParticipant,
	labels: {
		singular: 'XMTP participant',
		plural: 'XMTP participants',
	},
})({
	$conversation: {
		entityType: EntityType.XmtpConversation,
		cardinality: EntityFieldCardinality.One,
	},
	inboxId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		ConversationInboxId: [
			'$conversation',
			'inboxId',
		],
	},
})
