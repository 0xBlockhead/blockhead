// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum AtprotoActorSelector {
	Did = 'Did',
	Handle = 'Handle',
}
export default {
	entityType: EntityType.AtprotoActor,
	label: 'AT Protocol account',
	labelPlural: 'AT Protocol accounts',
	description: 'An AT Protocol actor is a DID-addressed repository identity. Handles, display names, avatars, banners, and counts are mutable appview observations over that identity.',
	selectors: [
		{
			name: AtprotoActorSelector.Did,
			fields: [
				'did',
			],
		},
		{
			name: AtprotoActorSelector.Handle,
			fields: [
				'handle',
			],
		},
	],
	fields: [
		{
			name: 'did',
			label: 'DID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'handle',
			label: 'Handle',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'displayName',
			label: 'Display name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			label: 'Description',
			description: 'The profile description from the current appview profile record.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'indexedAt',
			label: 'Indexed',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			label: 'Avatar',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$banner',
			label: 'Banner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Metric observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AtprotoActor_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Atproto_Xrpc,
			],
		},
		{
			name: '$$posts',
			label: 'Posts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AtprotoPost,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Atproto_Xrpc,
			],
		},
	],
} as const satisfies EntityDefinition
