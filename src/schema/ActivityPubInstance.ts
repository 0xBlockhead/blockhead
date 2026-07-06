// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum ActivityPubInstanceSelector {
	InstanceOriginSource = 'InstanceOriginSource',
}
export default {
	entityType: EntityType.ActivityPubInstance,
	label: 'ActivityPub instance',
	labelPlural: 'ActivityPub instances',
	description: 'A configured Mastodon-compatible ActivityPub server observed through the shared Mastodon REST source.',
	selectors: [
		{
			name: ActivityPubInstanceSelector.InstanceOriginSource,
			fields: [
				'instanceOrigin',
				'source',
			],
		},
	],
	fields: [
		{
			name: 'instanceOrigin',
			label: 'Instance origin',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that observes this ActivityPub instance.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'title',
			label: 'Title',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			label: 'Description',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'version',
			label: 'Version',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$peers',
			label: 'Peers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActivityPubInstancePeer,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Mastodon_Rest,
			],
		},
		{
			name: '$$moderatedDomains',
			label: 'Moderated domains',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActivityPubInstanceModeratedDomain,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Mastodon_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
