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
		label: 'local node state',
		entityType: EntityType.BlockheadLightningNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	$channel: {
		label: 'channel',
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.One,
	},
	private: {
		label: 'private',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	initiator: {
		label: 'initiator',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadLightningChannelState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$htlcs: {
		label: 'htlcs',
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
