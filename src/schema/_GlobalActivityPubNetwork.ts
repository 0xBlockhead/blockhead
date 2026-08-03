// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const mastodonRestSources = [
	Source.Mastodon_Rest,
] as const

export default entity({
	entityType: EntityType._GlobalActivityPubNetwork,
	labels: {
		singular: 'global ActivityPub network',
		plural: 'global ActivityPub networks',
	},
})({
	scope: {
		primitiveType: type.unit('_GlobalActivityPubNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedActors: {
		entityType: EntityType.ActivityPubActor,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: mastodonRestSources,
	},
	$$observedNotes: {
		entityType: EntityType.ActivityPubNote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: mastodonRestSources,
	},
	$$instances: {
		entityType: EntityType.ActivityPubInstance,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType._GlobalActivityPubNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
