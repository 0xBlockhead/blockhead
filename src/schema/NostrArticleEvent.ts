// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NostrArticleEvent,
	labels: {
		singular: 'Nostr article event',
		plural: 'Nostr article events',
	},
	description: 'One cryptographically signed kind-30023 version of a stable Nostr article coordinate.',
})({
	eventId: {
		label: 'Event ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$article: {
		label: 'Article',
		entityType: EntityType.NostrArticle,
		cardinality: EntityFieldCardinality.One,
	},
	pubkey: {
		label: 'Pubkey',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	identifier: {
		label: 'Identifier',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		label: 'Kind',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		label: 'Created',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		label: 'Signature',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tags: {
		label: 'Tags',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	title: {
		label: 'Title',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	summary: {
		label: 'Summary',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	imageUrl: {
		label: 'Image URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	content: {
		label: 'Content',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sensitive: {
		label: 'Sensitive',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentWarning: {
		label: 'Content warning',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedAt: {
		label: 'Published',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$author: {
		label: 'Author',
		entityType: EntityType.NostrProfile,
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		CanonicalEventId: [
			'eventId',
		],
	},
})
