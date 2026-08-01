// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._GlobalActivityPubNetwork,
	labels: {
		singular: 'global ActivityPub network',
		plural: 'global ActivityPub networks',
	},
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		primitiveType: type.unit('_GlobalActivityPubNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedActors: {
		label: 'Observed actors',
		entityType: EntityType.ActivityPubActor,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Mastodon_Rest,
		],
	},
	$$observedNotes: {
		label: 'Observed notes',
		entityType: EntityType.ActivityPubNote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Mastodon_Rest,
		],
	},
	$$instances: {
		label: 'Instances',
		entityType: EntityType.ActivityPubInstance,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Timestamps',
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
