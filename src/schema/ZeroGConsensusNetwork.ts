import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum ZeroGConsensusNetworkSelector {
	NetworkConsensusNetworkId = 'networkConsensusNetworkId',
}

export default {
	entityType: EntityType.ZeroGConsensusNetwork,

	label: '0G consensus network',
	labelPlural: '0G consensus networks',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'consensusNetworkId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sharedStakingStatusSource',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$daQuorums',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGDaQuorum,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$storageProofs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGStorageProof,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
