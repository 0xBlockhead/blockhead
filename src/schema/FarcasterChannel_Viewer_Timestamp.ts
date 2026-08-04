// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { FarcasterChannelMemberRole } from '$/schema/FarcasterChannelMemberRole.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FarcasterChannel_Viewer_Timestamp,
	labels: {
		singular: 'Farcaster channel viewer observation',
		plural: 'Farcaster channel viewer observations',
	},
})({
	$channel: {
		entityType: EntityType.FarcasterChannel,
		cardinality: EntityFieldCardinality.One,
	},
	$viewer: {
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	following: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	member: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	role: {
		primitiveType: type.enumerated(...Object.values(FarcasterChannelMemberRole)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	followedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	memberAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ChannelViewerTimestampMsSource: [
			'$channel',
			'$viewer',
			'timestampMs',
			'source',
		],
	},
})
