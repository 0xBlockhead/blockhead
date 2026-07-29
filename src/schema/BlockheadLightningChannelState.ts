// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadLightningNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	$channel: {
		label: 'channel',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.One,
	},
	private: {
		label: 'private',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	initiator: {
		label: 'initiator',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadLightningChannelState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$htlcs: {
		label: 'htlcs',
		type: EntityFieldType.EntitiesReference,
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
