import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Transaction from '$/schema/NearTransaction.ts'

export default {
	entityType: EntityType.NearExecutionOutcome,

	label: 'NEAR Execution Outcome',
	labelPlural: 'NEAR Execution Outcomes',

	id: type({
		$transaction: Transaction.id,
		outcomeId: 'string',
	}),

	fields: [
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasBurnt',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$receipts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearReceipt,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
