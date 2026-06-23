import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum LightningChannelStatus {
	Open = 'Open',
	Active = 'Active',
	Inactive = 'Inactive',
	Closed = 'Closed',
	Pending = 'Pending',
	Unknown = 'Unknown',
}
export enum LightningChannelSelector {
	NetworkChannelId = 'networkChannelId',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'channelId',
			label: 'channel ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'shortChannelId',
			label: 'short channel ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$node',
			label: 'node',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LightningNode,
			cardinality: EntityFieldCardinality.Zero,
		},
		{
			name: '$node1',
			label: 'node1',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LightningNode,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fundingTransactionId',
			label: 'funding transaction ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fundingOutputIndex',
			label: 'funding output index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'openedAtMs',
			label: 'opened AT ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningChannel_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$localStates',
			label: 'local states',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLightningChannelState,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
