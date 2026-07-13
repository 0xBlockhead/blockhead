// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum A2aMessagePartSelector {
	MessagePartIndex = 'MessagePartIndex',
	ArtifactPartIndex = 'ArtifactPartIndex',
}
export const A2aMessagePart = entity({
	entityType: EntityType.A2aMessagePart,
	labels: {
		singular: 'a2a message part',
		plural: 'a2a message parts',
	},
})({
	$message: {
		label: 'message',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.A2aMessage,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$artifact: {
		label: 'artifact',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.A2aArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	partIndex: {
		label: 'part index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	partKind: {
		label: 'part kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	text: {
		label: 'text',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	uri: {
		label: 'URI',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mimeType: {
		label: 'mime type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		label: 'payload',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$aiArtifact: {
		label: 'AI artifact',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		MessagePartIndex: [
			'$message',
			'partIndex',
		],
		ArtifactPartIndex: [
			'$artifact',
			'partIndex',
		],
	},
})
