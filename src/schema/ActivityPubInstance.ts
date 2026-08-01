// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'

export default entity({
	entityType: EntityType.ActivityPubInstance,
	labels: {
		singular: 'ActivityPub instance',
		plural: 'ActivityPub instances',
	},
	description: 'A declared Mastodon-compatible ActivityPub server observed through the shared Mastodon REST source.',
})({
	instanceOrigin: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.ActivityPubInstance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Mastodon_Rest,
		],
	},
})({
	selectors: {
		InstanceOrigin: [
			'instanceOrigin',
		],
	},
})
