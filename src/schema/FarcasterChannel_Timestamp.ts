// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.FarcasterChannel,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	followerCount: {
		label: 'Followers',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	memberCount: {
		label: 'Members',
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
