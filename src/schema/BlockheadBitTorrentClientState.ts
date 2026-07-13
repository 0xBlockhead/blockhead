// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadBitTorrentClientStateSelector {
	ClientId = 'ClientId',
}
export const BlockheadBitTorrentClientState = entity({
	entityType: EntityType.BlockheadBitTorrentClientState,
	labels: {
		singular: 'blockhead bit torrent client state',
		plural: 'blockhead bit torrent client states',
	},
})({
	clientId: {
		label: 'client ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	clientName: {
		label: 'client name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	peerId: {
		label: 'peer ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dhtNodeId: {
		label: 'DHT node ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transfers: {
		label: 'transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadBitTorrentTransfer_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
