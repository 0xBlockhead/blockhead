// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { XmtpConversationConsentState } from '$/schema/XmtpConversationConsentState.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XmtpConversation,
	labels: {
		singular: 'XMTP conversation',
		plural: 'XMTP conversations',
	},
})({
	id: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	peerInboxId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	topic: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	consentState: {
		primitiveType: type.enumerated(...Object.values(XmtpConversationConsentState)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$messages: {
		entityType: EntityType.XmtpMessage,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$participants: {
		entityType: EntityType.XmtpParticipant,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
