// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated('Guid', 'Link'),
		cardinality: EntityFieldCardinality.One,
	},
	itemIdentity: {
		label: 'Identity',
		description: 'The publisher GUID, falling back to the normalized item link only when GUID is absent.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	guid: {
		label: 'GUID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	title: {
		label: 'Title',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	link: {
		label: 'Link',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	content: {
		label: 'Content',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	author: {
		label: 'Author',
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
	updatedAt: {
		label: 'Updated',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	categories: {
		label: 'Categories',
		type: EntityFieldType.Primitive,
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	enclosureUrl: {
		label: 'Enclosure URL',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	commentsUrl: {
		label: 'Comments URL',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$feed: {
		label: 'Feed',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RssFeed,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
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
