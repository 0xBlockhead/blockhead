// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	peerId: {
		label: 'peer ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	endpoint: {
		label: 'endpoint',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signedPeerRecord: {
		label: 'signed peer record',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadCodexStorageNodeState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$storedData: {
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
