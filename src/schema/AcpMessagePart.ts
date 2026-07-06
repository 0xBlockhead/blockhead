// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum AcpMessagePartSelector {
	MessagePartIndex = 'MessagePartIndex',
}
export default {
	entityType: EntityType.AcpMessagePart,
	label: 'acp message part',
	labelPlural: 'acp message parts',
	selectors: [
		{
			name: AcpMessagePartSelector.MessagePartIndex,
			fields: [
				'$message',
				'partIndex',
			],
		},
	],
	fields: [
		{
			name: '$message',
			label: 'message',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AcpMessage,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'partIndex',
			label: 'part index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'partKind',
			label: 'part kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'text',
			label: 'text',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'uri',
			label: 'URI',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mimeType',
			label: 'mime type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'payload',
			label: 'payload',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$artifact',
			label: 'artifact',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AiArtifact,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
