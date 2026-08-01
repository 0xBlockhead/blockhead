// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AtprotoActor,
	labels: {
		singular: 'AT Protocol account',
		plural: 'AT Protocol accounts',
	},
	description: 'An AT Protocol actor is a DID-addressed repository identity. Handles, display names, avatars, banners, and counts are mutable appview observations over that identity.',
})({
	did: {
		label: 'DID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	handle: {
		label: 'Handle',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Metric observations',
		entityType: EntityType.AtprotoActor_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Atproto_Xrpc,
		],
	},
	$$posts: {
		label: 'Posts',
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
