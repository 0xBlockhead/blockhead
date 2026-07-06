// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum A2aMessagePartSelector {
	MessagePartIndex = 'MessagePartIndex',
	ArtifactPartIndex = 'ArtifactPartIndex',
}
export default {
	entityType: EntityType.A2aMessagePart,
	label: 'a2a message part',
	labelPlural: 'a2a message parts',
	selectors: [
		{
			name: A2aMessagePartSelector.MessagePartIndex,
			fields: [
				'$message',
				'partIndex',
			],
		},
		{
			name: A2aMessagePartSelector.ArtifactPartIndex,
			fields: [
				'$artifact',
				'partIndex',
			],
		},
	],
	fields: [
		{
			name: '$message',
			label: 'message',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.A2aMessage,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$artifact',
			label: 'artifact',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.A2aArtifact,
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
			name: '$aiArtifact',
			label: 'AI artifact',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AiArtifact,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
