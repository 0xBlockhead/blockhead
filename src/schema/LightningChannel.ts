// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LightningChannelStatus {
	Open = 'Open',
	Active = 'Active',
	Inactive = 'Inactive',
	Closed = 'Closed',
	Pending = 'Pending',
	Unknown = 'Unknown',
}
export enum LightningChannelSelector {
	NetworkChannelId = 'NetworkChannelId',
}
export default {
	entityType: EntityType.LightningChannel,
	label: 'Lightning channel',
	labelPlural: 'Lightning channels',
	selectors: [
		{
			name: LightningChannelSelector.NetworkChannelId,
			fields: [
				'$network',
				'channelId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'channelId',
			label: 'Channel ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'shortChannelId',
			label: 'Short channel ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$node1',
			label: 'Peer node',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LightningNode,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fundingTransactionId',
			label: 'Funding transaction ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fundingOutputIndex',
			label: 'Funding output index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'openedAtMs',
			label: 'Opened',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningChannel_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$localStates',
			label: 'Local states',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLightningChannelState,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
