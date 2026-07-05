// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IbcChannelSelector {
	NetworkPortIdChannelId = 'NetworkPortIdChannelId',
}
export default {
	entityType: EntityType.IbcChannel,
	label: 'IBC channel',
	labelPlural: 'IBC channels',
	selectors: [
		{
			name: IbcChannelSelector.NetworkPortIdChannelId,
			fields: [
				'$network',
				'portId',
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
				name: 'portId',
				label: 'Port ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
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
				name: '$connection',
				label: 'Connection',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.IbcConnection,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$client',
				label: 'Client',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.IbcClient,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'counterpartyChainId',
				label: 'Counterparty chain ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'counterpartyPortId',
				label: 'Counterparty port ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'counterpartyChannelId',
				label: 'Counterparty channel ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'state',
				label: 'State',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ordering',
				label: 'Ordering',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'version',
				label: 'Version',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nextSequenceSend',
				label: 'Next sequence send',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nextSequenceReceive',
				label: 'Next sequence receive',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$counterpartyNetwork',
				label: 'Counterparty network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$packets',
				label: 'Packets',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IbcPacket,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
