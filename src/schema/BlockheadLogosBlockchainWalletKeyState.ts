import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadLogosBlockchainWalletKeyStateSelector {
	NodeStatePublicKey = '$nodeState+publicKey',
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
			primitiveType: type("string"),
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
