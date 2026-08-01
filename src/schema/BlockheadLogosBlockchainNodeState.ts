// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadLogosBlockchainNodeState,
	labels: {
		singular: 'blockhead Logos blockchain node state',
		plural: 'blockhead Logos blockchain node states',
	},
})({
	connectionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	peerId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	endpoint: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.BlockheadLogosBlockchainNodeState_Timestamp,
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
