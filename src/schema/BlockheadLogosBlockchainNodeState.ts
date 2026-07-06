// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum BlockheadLogosBlockchainNodeStateSelector {
	ConnectionIdPeerId = 'ConnectionIdPeerId',
}
export default {
	entityType: EntityType.BlockheadLogosBlockchainNodeState,
	label: 'blockhead Logos blockchain node state',
	labelPlural: 'blockhead Logos blockchain node states',
	selectors: [
		{
			name: BlockheadLogosBlockchainNodeStateSelector.ConnectionIdPeerId,
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
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLogosBlockchainNodeState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
