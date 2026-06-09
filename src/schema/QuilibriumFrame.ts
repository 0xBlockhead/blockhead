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
	entityType: EntityType.QuilibriumFrame,

	label: 'Quilibrium Frame',
	labelPlural: 'Quilibrium Frames',

	id: type({
		$network: Network.id,
		frameNumber: 'bigint',
		shardKey: 'string',
	}),

	fields: [
		{
			name: 'frameHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$shard',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.QuilibriumShard,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$prover',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.QuilibriumProver,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
