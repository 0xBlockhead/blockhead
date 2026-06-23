import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ZeroGConsensusNetworkSelector {
	NetworkConsensusNetworkId = 'networkConsensusNetworkId',
}
export default {
	entityType: EntityType.ZeroGConsensusNetwork,
	label: 'zero g consensus network',
	labelPlural: 'zero g consensus networks',
	selectors: [
		{
			name: ZeroGConsensusNetworkSelector.NetworkConsensusNetworkId,
			fields: [
				'$network',
				'consensusNetworkId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'consensusNetworkId',
			label: 'consensus network ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGConsensusNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$daQuorums',
			label: 'da quorums',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGDaQuorum,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$storageProofs',
			label: 'storage proofs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGStorageProof,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
