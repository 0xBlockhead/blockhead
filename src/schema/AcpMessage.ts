import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AcpMessageSelector {
	SessionMessageId = '$session+messageId',
}
export default {
	entityType: EntityType.AcpMessage,
	label: 'acp message',
	labelPlural: 'acp messages',
	selectors: [
		{
			name: AcpMessageSelector.SessionMessageId,
			fields: [
				'$session',
				'messageId',
			],
		},
	],
	fields: [
		{
			name: '$session',
			label: 'session',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AcpSession,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'messageId',
			label: 'message ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'role',
			label: 'role',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$parts',
			label: 'parts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AcpMessagePart,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
