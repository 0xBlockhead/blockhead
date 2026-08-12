// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadBitTorrentClientState,
	labels: {
		singular: 'blockhead bit torrent client state',
		plural: 'blockhead bit torrent client states',
	},
})({
	clientId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	clientName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.qBittorrentWebUi_Rest,
			Source.TransmissionRpc_JsonRpc,
		],
	},
	peerId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dhtNodeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transfers: {
		entityType: EntityType.BlockheadBitTorrentTransfer_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.qBittorrentWebUi_Rest,
			Source.TransmissionRpc_JsonRpc,
		],
	},
	$$timestamps: {
		entityType: EntityType.BlockheadBitTorrentClientState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.qBittorrentWebUi_Rest,
			Source.TransmissionRpc_JsonRpc,
		],
	},
})({
	selectors: {
		ClientId: [
			'clientId',
		],
	},
})
