// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const atprotoXrpcSources = [
	Source.Atproto_Xrpc,
] as const

export default entity({
	entityType: EntityType.AtprotoActor,
	labels: {
		singular: 'AT Protocol account',
		plural: 'AT Protocol accounts',
	},
	description: 'An AT Protocol actor is a DID-addressed repository identity. Handles, display names, avatars, banners, and counts are mutable appview observations over that identity.',
})({
	did: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	handle: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.AtprotoActor_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: atprotoXrpcSources,
	},
	$$posts: {
		entityType: EntityType.AtprotoPost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: atprotoXrpcSources,
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
