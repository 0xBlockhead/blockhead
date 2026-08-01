// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.A2aMessagePart,
	labels: {
		singular: 'a2a message part',
		plural: 'a2a message parts',
	},
})({
	$message: {
		label: 'message',
		entityType: EntityType.A2aMessage,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$artifact: {
		label: 'artifact',
		entityType: EntityType.A2aArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	partIndex: {
		label: 'part index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	partKind: {
		label: 'part kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	text: {
		label: 'text',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	uri: {
		label: 'URI',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mimeType: {
		label: 'mime type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		label: 'payload',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$aiArtifact: {
		label: 'AI artifact',
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
