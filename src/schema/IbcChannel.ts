// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IbcChannelSelector {
	NetworkPortIdChannelId = 'NetworkPortIdChannelId',
}
export const IbcChannel = entity({
	entityType: EntityType.IbcChannel,
	labels: {
		singular: 'IBC channel',
		plural: 'IBC channels',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	portId: {
		label: 'Port ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	channelId: {
		label: 'Channel ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$connection: {
		label: 'Connection',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IbcConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$client: {
		label: 'Client',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IbcClient,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterpartyChainId: {
		label: 'Counterparty chain ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterpartyPortId: {
		label: 'Counterparty port ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterpartyChannelId: {
		label: 'Counterparty channel ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		label: 'State',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ordering: {
		label: 'Ordering',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'Version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nextSequenceSend: {
		label: 'Next sequence send',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nextSequenceReceive: {
		label: 'Next sequence receive',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterpartyNetwork: {
		label: 'Counterparty network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$packets: {
		label: 'Packets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IbcPacket,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkPortIdChannelId: [
			'$network',
			'portId',
			'channelId',
		],
	},
})
