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
	entityType: EntityType.FilecoinBlock,

	label: 'Filecoin Block',
	labelPlural: 'Filecoin Blocks',

	id: type({
		$network: Network.id,
		cid: 'string',
	}),

	fields: [
		{
			name: '$tipset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinTipset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$miner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinMiner,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ticketVrFProof',
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
			name: '$$messages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinMessage,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
