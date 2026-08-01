// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NostrProfileMetadataEvent,
	labels: {
		singular: 'Nostr profile metadata event',
		plural: 'Nostr profile metadata events',
	},
	description: 'One cryptographically signed kind-0 metadata version for a stable Nostr profile.',
})({
	eventId: {
		label: 'Event ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$profile: {
		label: 'Profile',
		entityType: EntityType.NostrProfile,
		cardinality: EntityFieldCardinality.One,
	},
	pubkey: {
		label: 'Pubkey',
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
	content: {
		label: 'Signed content',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tags: {
		label: 'Tags',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	displayName: {
		label: 'Display name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	about: {
		label: 'About',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nip05: {
		label: 'NIP-05',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lud16: {
		label: 'Lightning address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lud06: {
		label: 'Lightning invoice',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	website: {
		label: 'Website',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	iconUrl: {
		label: 'Icon URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Icon',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bannerUrl: {
		label: 'Banner URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$banner: {
		label: 'Banner',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		CanonicalEventId: [
			'eventId',
		],
	},
})
