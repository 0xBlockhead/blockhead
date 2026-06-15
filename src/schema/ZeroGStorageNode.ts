import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'

export enum ZeroGStorageNodeSelector {
	NetworkNodeId = 'networkNodeId',
}

export default {
	entityType: EntityType.ZeroGStorageNode,

	label: '0G storage node',
	labelPlural: '0G storage nodes',

	selectors: [
		{
			name: ZeroGStorageNodeSelector.NetworkNodeId,
			fields: [
				'$network',
				'nodeId',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'nodeId',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$operator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'endpoint',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'balance',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'totalReward',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'winCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'miningAttempts',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$storedChunks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGDataChunk,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$proofs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGStorageProof,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
