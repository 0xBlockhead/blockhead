// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const constantsInternalSources = [
	Source.Constants_Internal,
] as const

export default entity({
	entityType: EntityType._GlobalNostrNetwork,
	labels: {
		singular: 'Nostr',
		plural: 'Nostr',
	},
	description: 'Nostr is a relay-based social protocol for signed events. Profiles, notes, reposts, and articles are event kinds; relays are transport endpoints and are not global proof that an event exists everywhere.',
})({
	scope: {
		primitiveType: type.unit('_GlobalNostrNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalSources,
	},
	registryName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalSources,
	},
	homeUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalSources,
	},
	docsUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalSources,
	},
	relationshipModel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalSources,
	},
	$$observedProfiles: {
		entityType: EntityType.NostrProfile,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: constantsInternalSources,
	},
	$$observedNotes: {
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: constantsInternalSources,
	},
	$$observedRelays: {
		entityType: EntityType.NostrRelay,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: constantsInternalSources,
	},
	$$observedReposts: {
		entityType: EntityType.NostrRepost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: constantsInternalSources,
	},
	$$observedReactions: {
		entityType: EntityType.NostrReaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: constantsInternalSources,
	},
	$$observedArticles: {
		entityType: EntityType.NostrArticle,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: constantsInternalSources,
	},
	$$timestamps: {
		entityType: EntityType._GlobalNostrNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
