// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum ActivityPubNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType.ActivityPubNetwork,
	label: 'ActivityPub',
	labelPlural: 'ActivityPub',
	description: 'ActivityPub is the W3C federation protocol. This hub shows bounded Mastodon-compatible actor and note windows from configured instance sources.',
	selectors: [
		{
			name: ActivityPubNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
				name: 'scope',
				label: 'Scope',
				description: 'The fixed scope value that identifies this hub row.',
				type: EntityFieldType.Primitive,
				primitiveType: type.unit('ActivityPubNetwork'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'protocolName',
				label: 'Protocol',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'homeUrl',
				label: 'Home URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'docsUrl',
				label: 'Docs URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$activityPubActors',
				label: 'Actors',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ActivityPubActor,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: '$$activityPubNotes',
				label: 'Notes',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ActivityPubNote,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Mastodon_Rest,
					Source.Fedi_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
