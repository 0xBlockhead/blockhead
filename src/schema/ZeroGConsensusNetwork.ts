import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.ZeroGConsensusNetwork,

	label: '0G consensus network',
	labelPlural: '0G consensus networks',

	id: type({
		$network: Network.id,
		consensusNetworkId: 'string',
	}),

	fields: [
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
