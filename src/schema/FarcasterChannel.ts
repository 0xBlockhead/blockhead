// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		label: 'URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	iconUrl: {
		label: 'Icon URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Icon',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	headerImageUrl: {
		label: 'Header image URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$headerImage: {
		label: 'Header image',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$lead: {
		label: 'Lead',
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$moderator: {
		label: 'Moderator',
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$moderators: {
		label: 'Moderators',
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.Many,
	},
	createdAt: {
		label: 'Created',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.FarcasterChannel_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	pinnedCastHash: {
		label: 'Pinned cast hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publicCasting: {
		label: 'Public casting',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	externalLinkTitle: {
		label: 'External link title',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	externalLinkUrl: {
		label: 'External link URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	followedAt: {
		label: 'Followed',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$casts: {
		label: 'Casts',
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
