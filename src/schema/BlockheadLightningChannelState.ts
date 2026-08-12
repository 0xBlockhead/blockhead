// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadLightningChannelState,
	labels: {
		singular: 'local LND channel state',
		plural: 'local LND channel states',
	},
	description: 'A macaroon-authorized observation from one configured local LND node. Its balances and pending HTLCs are private node state, not facts inferred from the public Lightning graph.',
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
