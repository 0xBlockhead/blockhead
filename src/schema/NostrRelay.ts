// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NostrRelaySelector {
	RelayUrl = 'RelayUrl',
}
export const NostrRelay = entity({
	entityType: EntityType.NostrRelay,
	label: 'Nostr relay',
	labelPlural: 'Nostr relays',
	description: 'A Nostr relay is a WebSocket endpoint that can publish, store, and serve signed events; relay metadata is optional NIP-11 source data.',
})({
	relayUrl: {
		label: 'Relay URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
			Source.NostrRelay_Nip11_Http,
		],
	},
	description: {
		label: 'Description',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
			Source.NostrRelay_Nip11_Http,
		],
	},
	software: {
		label: 'Software',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
			Source.NostrRelay_Nip11_Http,
		],
	},
	version: {
		label: 'Version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
			Source.NostrRelay_Nip11_Http,
		],
	},
	supportedNipCount: {
		label: 'Supported NIPs',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
			Source.NostrRelay_Nip11_Http,
		],
	},
	isPaid: {
		label: 'Paid relay',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
			Source.NostrRelay_Nip11_Http,
		],
	},
	limit: {
		label: 'Event limit',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NostrBand_Rest,
			Source.NostrRelay_Nip11_Http,
		],
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.NostrRelay_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		RelayUrl: [
			'relayUrl',
		],
	},
})
