// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum ActivityPubInstanceSelector {
	InstanceOriginSource = 'InstanceOriginSource',
}
export const ActivityPubInstance = entity({
	entityType: EntityType.ActivityPubInstance,
	label: 'ActivityPub instance',
	labelPlural: 'ActivityPub instances',
	description: 'A declared Mastodon-compatible ActivityPub server observed through the shared Mastodon REST source.',
})({
	instanceOrigin: {
		label: 'Instance origin',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that observes this ActivityPub instance.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		label: 'Title',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'Version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$peers: {
		label: 'Peers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ActivityPubInstancePeer,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Mastodon_Rest,
		],
	},
	$$moderatedDomains: {
		label: 'Moderated domains',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ActivityPubInstanceModeratedDomain,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Mastodon_Rest,
		],
	},
})({
	selectors: {
		InstanceOriginSource: [
			'instanceOrigin',
			'source',
		],
	},
})
