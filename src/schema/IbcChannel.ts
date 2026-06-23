import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum IbcChannelSelector {
	NetworkPortIdChannelId = '$network+portId+channelId',
}
export default {
	entityType: EntityType.IbcChannel,
	label: 'ibc channel',
	labelPlural: 'ibc channels',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'portId',
			label: 'port ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			name: '$connection',
			label: 'connection',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.IbcConnection,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$client',
			label: 'client',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.IbcClient,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'counterpartyChainId',
			label: 'counterparty chain ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'counterpartyPortId',
			label: 'counterparty port ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'counterpartyChannelId',
			label: 'counterparty channel ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'state',
			label: 'state',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ordering',
			label: 'ordering',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'version',
			label: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nextSequenceSend',
			label: 'next sequence send',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nextSequenceReceive',
			label: 'next sequence receive',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$counterpartyNetwork',
			label: 'counterparty network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$packets',
			label: 'packets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.IbcPacket,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
