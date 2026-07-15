// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
export const LightningChannel = entity({
	entityType: EntityType.LightningChannel,
	labels: {
		singular: 'Lightning channel',
		plural: 'Lightning channels',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	channelId: {
		label: 'Channel ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	shortChannelId: {
		label: 'Short channel ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$node1: {
		label: 'Peer node',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LightningNode,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fundingTransactionId: {
		label: 'Funding transaction ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fundingOutputIndex: {
		label: 'Funding output index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	openedAtMs: {
		label: 'Opened',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LightningChannel_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$localStates: {
		label: 'Local states',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadLightningChannelState,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkChannelId: [
			'$network',
			'channelId',
		],
	},
})
