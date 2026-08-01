// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadLightningChannelState,
	labels: {
		singular: 'blockhead Lightning channel state',
		plural: 'blockhead Lightning channel states',
	},
})({
	$localNodeState: {
		entityType: EntityType.BlockheadLightningNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	$channel: {
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.One,
	},
	private: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	initiator: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.BlockheadLightningChannelState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$htlcs: {
		entityType: EntityType.BlockheadLightningHtlc,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		LocalNodeStateChannel: [
			'$localNodeState',
			'$channel',
		],
	},
})
