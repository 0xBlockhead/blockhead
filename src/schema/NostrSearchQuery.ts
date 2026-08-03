// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const nostrRelayWebSocketSources = [
	Source.NostrRelay_WebSocket,
] as const

export default entity({
	entityType: EntityType.NostrSearchQuery,
	labels: {
		singular: 'Nostr profile search',
		plural: 'Nostr profile searches',
	},
	description: 'A bounded NIP-50 relay profile search addressed by its normalized query. Completion means the selected relay emitted EOSE; results are observed, not globally exhaustive.',
})({
	query: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	resultCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: nostrRelayWebSocketSources,
	},
	completed: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: nostrRelayWebSocketSources,
	},
	$$profiles: {
		entityType: EntityType.NostrProfile,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: nostrRelayWebSocketSources,
	},
})({
	selectors: {
		Query: [
			'query',
		],
	},
})
