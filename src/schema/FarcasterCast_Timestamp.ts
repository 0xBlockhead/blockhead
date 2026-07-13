// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum FarcasterCast_TimestampSelector {
	FarcasterCastTimestampMs = 'FarcasterCastTimestampMs',
}
export const FarcasterCast_Timestamp = entity({
	entityType: EntityType.FarcasterCast_Timestamp,
	labels: {
		singular: 'Farcaster cast observation',
		plural: 'Farcaster cast observations',
	},
})({
	$cast: {
		label: 'Cast',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	likeCount: {
		label: 'Likes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	recastCount: {
		label: 'Recasts',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	replyCount: {
		label: 'Replies',
		type: EntityFieldType.Primitive,
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
