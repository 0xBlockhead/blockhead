import { type } from 'arktype'
import {
	type EntityDefinition,
	type EntityFieldDefinition,
	EntityFieldCardinality,
	EntityFieldType,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum XmtpConversationSelector {
	Id = 'id',
}


export enum XmtpConversationConsentState {
	Unknown = 'unknown',
	Allowed = 'allowed',
	Denied = 'denied',
}

export default {
	entityType: EntityType.XmtpConversation,

	label: 'XMTP Conversation',
	labelPlural: 'XMTP Conversations',

	selectors: [
		{
			name: XmtpConversationSelector.Id,
			fields: [
				'id',
			],
		},
	],

	fields: [
		{
			name: 'id',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'peerInboxId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'topic',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAtMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'consentState',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(XmtpConversationConsentState),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
