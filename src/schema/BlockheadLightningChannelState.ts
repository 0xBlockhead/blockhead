// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadLightningChannelStateSelector {
	LocalNodeStateChannel = 'LocalNodeStateChannel',
}
export default {
	entityType: EntityType.BlockheadLightningChannelState,
	label: 'blockhead Lightning channel state',
	labelPlural: 'blockhead Lightning channel states',
	selectors: [
		{
			name: BlockheadLightningChannelStateSelector.LocalNodeStateChannel,
			fields: [
				'$localNodeState',
				'$channel',
			],
		},
	],
	fields: [
		{
			name: '$localNodeState',
			label: 'local node state',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadLightningNodeState,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$channel',
			label: 'channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LightningChannel,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'private',
			label: 'private',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'initiator',
			label: 'initiator',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLightningChannelState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$htlcs',
			label: 'htlcs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLightningHtlc,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
