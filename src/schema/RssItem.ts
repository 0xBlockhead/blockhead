// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RssItem,
	labels: {
		singular: 'RSS item',
		plural: 'RSS items',
	},
})({
	itemIdentityKind: {
		label: 'Identity kind',
		description: 'GUID when the publisher supplies one; otherwise link.',
		primitiveType: type.enumerated('Guid', 'Link'),
		cardinality: EntityFieldCardinality.One,
	},
	itemIdentity: {
		label: 'Identity',
		description: 'The publisher GUID, falling back to the normalized item link only when GUID is absent.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	guid: {
		label: 'GUID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	title: {
		label: 'Title',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	link: {
		label: 'Link',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	content: {
		label: 'Content',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	author: {
		label: 'Author',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedAt: {
		label: 'Published',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAt: {
		label: 'Updated',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	categories: {
		label: 'Categories',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	enclosureUrl: {
		label: 'Enclosure URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	commentsUrl: {
		label: 'Comments URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$feed: {
		label: 'Feed',
		entityType: EntityType.RssFeed,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.RssItem_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		FeedIdentity: [
			'$feed',
			'itemIdentityKind',
			'itemIdentity',
		],
	},
})
