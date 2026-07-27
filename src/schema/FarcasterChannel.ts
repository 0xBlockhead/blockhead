// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FarcasterChannel,
	labels: {
		singular: 'Farcaster channel',
		plural: 'Farcaster channels',
	},
})({
	id: {
		label: 'ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		label: 'URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	iconUrl: {
		label: 'Icon URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Icon',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	headerImageUrl: {
		label: 'Header image URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$headerImage: {
		label: 'Header image',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$lead: {
		label: 'Lead',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$moderator: {
		label: 'Moderator',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$moderators: {
		label: 'Moderators',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.Many,
	},
	createdAt: {
		label: 'Created',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FarcasterChannel_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	pinnedCastHash: {
		label: 'Pinned cast hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publicCasting: {
		label: 'Public casting',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	externalLinkTitle: {
		label: 'External link title',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	externalLinkUrl: {
		label: 'External link URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	followedAt: {
		label: 'Followed',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$casts: {
		label: 'Casts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Neynar_Rest,
			Source.Snapchain_Rest,
		],
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
