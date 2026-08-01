// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadBitTorrentClientState,
	labels: {
		singular: 'blockhead bit torrent client state',
		plural: 'blockhead bit torrent client states',
	},
})({
	clientId: {
		label: 'client ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	clientName: {
		label: 'client name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	peerId: {
		label: 'peer ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dhtNodeId: {
		label: 'DHT node ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transfers: {
		label: 'transfers',
		entityType: EntityType.BlockheadBitTorrentTransfer_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadBitTorrentClientState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ClientId: [
			'clientId',
		],
	},
})
