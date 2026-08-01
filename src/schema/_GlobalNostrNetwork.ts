// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._GlobalNostrNetwork,
	labels: {
		singular: 'Nostr',
		plural: 'Nostr',
	},
	description: 'Nostr is a relay-based social protocol for signed events. Profiles, notes, reposts, and articles are event kinds; relays are transport endpoints and are not global proof that an event exists everywhere.',
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this global hub row.',
		primitiveType: type.unit('_GlobalNostrNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'Protocol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	registryName: {
		label: 'Registry name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	homeUrl: {
		label: 'Home',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	docsUrl: {
		label: 'Docs',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	relationshipModel: {
		label: 'Connection model',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$observedProfiles: {
		label: 'Profiles',
		entityType: EntityType.NostrProfile,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
		],
	},
	$$observedNotes: {
		label: 'Notes',
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
		],
	},
	$$observedRelays: {
		label: 'Relays',
		entityType: EntityType.NostrRelay,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
		],
	},
	$$observedReposts: {
		label: 'Reposts',
		entityType: EntityType.NostrRepost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	$$observedReactions: {
		label: 'Reactions',
		entityType: EntityType.NostrReaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedArticles: {
		label: 'Articles',
		entityType: EntityType.NostrArticle,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	$$timestamps: {
		label: 'Observations',
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
