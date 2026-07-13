// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum AtprotoActorSelector {
	Did = 'Did',
	Handle = 'Handle',
}
export const AtprotoActor = entity({
	entityType: EntityType.AtprotoActor,
	labels: {
		singular: 'AT Protocol account',
		plural: 'AT Protocol accounts',
	},
	description: 'An AT Protocol actor is a DID-addressed repository identity. Handles, display names, avatars, banners, and counts are mutable appview observations over that identity.',
})({
	did: {
		label: 'DID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	handle: {
		label: 'Handle',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	displayName: {
		label: 'Display name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'The profile description from the current appview profile record.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexedAt: {
		label: 'Indexed',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Avatar',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$banner: {
		label: 'Banner',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Metric observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AtprotoActor_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Atproto_Xrpc,
		],
	},
	$$posts: {
		label: 'Posts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AtprotoPost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Atproto_Xrpc,
		],
	},
})({
	selectors: {
		Did: [
			'did',
		],
		Handle: [
			'handle',
		],
	},
})
