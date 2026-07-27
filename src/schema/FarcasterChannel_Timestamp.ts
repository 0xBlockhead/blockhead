// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FarcasterChannel_Timestamp,
	labels: {
		singular: 'Farcaster channel observation',
		plural: 'Farcaster channel observations',
	},
})({
	$channel: {
		label: 'Channel',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FarcasterChannel,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	followerCount: {
		label: 'Followers',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	memberCount: {
		label: 'Members',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		FarcasterChannelTimestampMs: [
			'$channel',
			'timestampMs',
		],
	},
})
