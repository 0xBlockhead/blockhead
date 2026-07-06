// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadBitTorrentClientStateSelector {
	ClientId = 'ClientId',
}
export default {
	entityType: EntityType.BlockheadBitTorrentClientState,
	label: 'blockhead bit torrent client state',
	labelPlural: 'blockhead bit torrent client states',
	selectors: [
		{
			name: BlockheadBitTorrentClientStateSelector.ClientId,
			fields: [
				'clientId',
			],
		},
	],
	fields: [
		{
			name: 'clientId',
			label: 'client ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'clientName',
			label: 'client name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'peerId',
			label: 'peer ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'dhtNodeId',
			label: 'DHT node ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$transfers',
			label: 'transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadBitTorrentTransfer_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadBitTorrentClientState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
