// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum BlockheadCodexStorageNodeStateSelector {
	ConnectionIdPeerId = 'ConnectionIdPeerId',
}
export default {
	entityType: EntityType.BlockheadCodexStorageNodeState,
	label: 'blockhead codex storage node state',
	labelPlural: 'blockhead codex storage node states',
	selectors: [
		{
			name: BlockheadCodexStorageNodeStateSelector.ConnectionIdPeerId,
			fields: [
				'connectionId',
				'peerId',
			],
		},
	],
	fields: [
		{
				name: 'connectionId',
				label: 'connection ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'peerId',
				label: 'peer ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'endpoint',
				label: 'endpoint',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'signedPeerRecord',
				label: 'signed peer record',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadCodexStorageNodeState_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$storedData',
				label: 'stored data',
				labelPlural: 'stored data',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadCodexStoredData,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
