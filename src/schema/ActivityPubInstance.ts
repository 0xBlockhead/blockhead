// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum ActivityPubInstanceSelector {
	InstanceOrigin = 'InstanceOrigin',
}
export const ActivityPubInstance = entity({
	entityType: EntityType.ActivityPubInstance,
	labels: {
		singular: 'ActivityPub instance',
		plural: 'ActivityPub instances',
	},
	description: 'A declared Mastodon-compatible ActivityPub server observed through the shared Mastodon REST source.',
})({
	instanceOrigin: {
		label: 'Instance origin',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
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
