// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NostrRelay,
	labels: {
		singular: 'Nostr relay',
		plural: 'Nostr relays',
	},
	description: 'A Nostr relay is a WebSocket endpoint that can publish, store, and serve signed events; relay metadata is optional NIP-11 source data.',
})({
	relayUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$notes: {
		entityType: EntityType.NostrNote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NostrRelay_WebSocket,
		],
	},
	$$timestamps: {
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
