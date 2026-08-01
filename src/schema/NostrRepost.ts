// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NostrRepost,
	labels: {
		singular: 'Nostr repost',
		plural: 'Nostr reposts',
	},
	description: 'A Nostr repost is a kind-6 or kind-16 event keyed by event id and linked to the reposted note or article.',
})({
	eventId: {
		label: 'Event ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		label: 'Kind',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	pubkey: {
		label: 'Pubkey',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	createdAt: {
		label: 'Created',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	tags: {
		label: 'Tags',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	repostedEventId: {
		label: 'Reposted event ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	$author: {
		label: 'Author',
		entityType: EntityType.NostrProfile,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	$repostedNote: {
		label: 'Reposted note',
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	$repostedArticle: {
		label: 'Reposted article',
		entityType: EntityType.NostrArticle,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
})({
	selectors: {
		CanonicalEventId: [
			'eventId',
		],
	},
})
