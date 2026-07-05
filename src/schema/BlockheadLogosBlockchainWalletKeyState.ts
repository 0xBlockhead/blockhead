// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadLogosBlockchainWalletKeyStateSelector {
	NodeStatePublicKey = 'NodeStatePublicKey',
}
export default {
	entityType: EntityType.BlockheadLogosBlockchainWalletKeyState,
	label: 'blockhead Logos blockchain wallet key state',
	labelPlural: 'blockhead Logos blockchain wallet key states',
	selectors: [
		{
			name: BlockheadLogosBlockchainWalletKeyStateSelector.NodeStatePublicKey,
			fields: [
				'$nodeState',
				'publicKey',
			],
		},
	],
	fields: [
		{
				name: '$nodeState',
				label: 'node state',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadLogosBlockchainNodeState,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'publicKey',
				label: 'public key',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
