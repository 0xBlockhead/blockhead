// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadCodexStorageNodeState,
	labels: {
		singular: 'blockhead codex storage node state',
		plural: 'blockhead codex storage node states',
	},
})({
	connectionId: {
		label: 'connection ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	peerId: {
		label: 'peer ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	endpoint: {
		label: 'endpoint',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signedPeerRecord: {
		label: 'signed peer record',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadCodexStorageNodeState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$storedData: {
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadCodexStoredData,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ConnectionIdPeerId: [
			'connectionId',
			'peerId',
		],
	},
})
