import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.FilecoinMiner,

	label: 'Filecoin Miner',
	labelPlural: 'Filecoin Miners',

	id: type({
		$network: Network.id,
		minerAddress: 'string',
	}),

	fields: [
		{
			name: '$owner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$worker',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'peerId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'qualityAdjustedPower',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$sectors',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinSector,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
