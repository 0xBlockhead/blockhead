// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { LightningChannelStatus } from '$/schema/LightningChannelStatus.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LightningChannel,
	labels: {
		singular: 'Lightning channel',
		plural: 'Lightning channels',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	channelId: {
		label: 'Channel ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	shortChannelId: {
		label: 'Short channel ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$node1: {
		label: 'Peer node',
		entityType: EntityType.LightningNode,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fundingTransactionId: {
		label: 'Funding transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fundingOutputIndex: {
		label: 'Funding output index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	openedAtMs: {
		label: 'Opened',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.LightningChannel_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$localStates: {
		label: 'Local states',
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
