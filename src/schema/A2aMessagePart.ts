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
		entityType: EntityType.A2aMessage,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$artifact: {
		entityType: EntityType.A2aArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	partIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	partKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	text: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	uri: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mimeType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$aiArtifact: {
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
