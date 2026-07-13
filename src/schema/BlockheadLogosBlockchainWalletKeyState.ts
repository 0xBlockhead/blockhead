// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadLogosBlockchainWalletKeyStateSelector {
	NodeStatePublicKey = 'NodeStatePublicKey',
}
export const BlockheadLogosBlockchainWalletKeyState = entity({
	entityType: EntityType.BlockheadLogosBlockchainWalletKeyState,
	labels: {
		singular: 'blockhead Logos blockchain wallet key state',
		plural: 'blockhead Logos blockchain wallet key states',
	},
})({
	$nodeState: {
		label: 'node state',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadLogosBlockchainNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	publicKey: {
		label: 'public key',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
