// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum NostrArticleEventSelector {
	CanonicalEventId = 'CanonicalEventId',
}
export const NostrArticleEvent = entity({
	entityType: EntityType.NostrArticleEvent,
	labels: {
		singular: 'Nostr article event',
		plural: 'Nostr article events',
	},
	description: 'One cryptographically signed kind-30023 version of a stable Nostr article coordinate.',
})({
	eventId: {
		label: 'Event ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$article: {
		label: 'Article',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.NostrArticle,
		cardinality: EntityFieldCardinality.One,
	},
	pubkey: {
		label: 'Pubkey',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	identifier: {
		label: 'Identifier',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		label: 'Kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		label: 'Created',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		label: 'Signature',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tags: {
		label: 'Tags',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	title: {
		label: 'Title',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	summary: {
		label: 'Summary',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	imageUrl: {
		label: 'Image URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	content: {
		label: 'Content',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sensitive: {
		label: 'Sensitive',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentWarning: {
		label: 'Content warning',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedAt: {
		label: 'Published',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$author: {
		label: 'Author',
		type: EntityFieldType.EntityReference,
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
