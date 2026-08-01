// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IbcChannel,
	labels: {
		singular: 'IBC channel',
		plural: 'IBC channels',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	portId: {
		label: 'Port ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	channelId: {
		label: 'Channel ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$connection: {
		label: 'Connection',
		entityType: EntityType.IbcConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$client: {
		label: 'Client',
		entityType: EntityType.IbcClient,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterpartyChainId: {
		label: 'Counterparty chain ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterpartyPortId: {
		label: 'Counterparty port ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterpartyChannelId: {
		label: 'Counterparty channel ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		label: 'State',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ordering: {
		label: 'Ordering',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'Version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nextSequenceSend: {
		label: 'Next sequence send',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nextSequenceReceive: {
		label: 'Next sequence receive',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterpartyNetwork: {
		label: 'Counterparty network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$packets: {
		label: 'Packets',
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
