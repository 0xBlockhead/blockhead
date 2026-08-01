// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'

export default entity({
	entityType: EntityType.BlockheadLogosBlockchainWalletKeyState,
	labels: {
		singular: 'blockhead Logos blockchain wallet key state',
		plural: 'blockhead Logos blockchain wallet key states',
	},
})({
	$nodeState: {
		entityType: EntityType.BlockheadLogosBlockchainNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	publicKey: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NodeStatePublicKey: [
			'$nodeState',
			'publicKey',
		],
	},
})
