// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NostrRelaySelector {
	RelayUrl = 'RelayUrl',
}
export const NostrRelay = entity({
	entityType: EntityType.NostrRelay,
	labels: {
		singular: 'Nostr relay',
		plural: 'Nostr relays',
	},
	description: 'A Nostr relay is a WebSocket endpoint that can publish, store, and serve signed events; relay metadata is optional NIP-11 source data.',
})({
	relayUrl: {
		label: 'Relay URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.NostrRelay_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NostrBand_Rest,
			Source.NostrRelay_Nip11_Http,
		],
	},
})({
	selectors: {
		RelayUrl: [
			'relayUrl',
		],
	},
})
