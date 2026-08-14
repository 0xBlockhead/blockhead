// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadLightningPeer,
	labels: {
		singular: 'local LND peer',
		plural: 'local LND peers',
	},
	description: 'A peer connection observed through the configured local LND node\'s macaroon-authorized API. Its optional public Lightning node link is set only when the peer appears in the public graph, never fabricated from private channels.',
})({
	$localNodeState: {
		entityType: EntityType.BlockheadLightningNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	publicKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$node: {
		entityType: EntityType.LightningNode,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.BlockheadLightningPeer_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		LocalNodeStatePublicKey: [
			'$localNodeState',
			'publicKey',
		],
	},
})
