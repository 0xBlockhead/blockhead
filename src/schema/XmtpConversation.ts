// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { XmtpConversationConsentState } from '$/schema/XmtpConversationConsentState.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XmtpConversation,
	labels: {
		singular: 'XMTP conversation',
		plural: 'XMTP conversations',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	peerInboxId: {
		label: 'Peer inbox ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	topic: {
		label: 'Topic',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAtMs: {
		label: 'Created',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	consentState: {
		label: 'Consent',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
