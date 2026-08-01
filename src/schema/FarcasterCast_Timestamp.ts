// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FarcasterCast_Timestamp,
	labels: {
		singular: 'Farcaster cast observation',
		plural: 'Farcaster cast observations',
	},
})({
	$cast: {
		label: 'Cast',
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	likeCount: {
		label: 'Likes',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	recastCount: {
		label: 'Recasts',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	replyCount: {
		label: 'Replies',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		FarcasterCastTimestampMs: [
			'$cast',
			'timestampMs',
		],
	},
})
