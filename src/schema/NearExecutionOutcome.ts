import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum NearExecutionOutcomeSelector {
	NearTransactionOutcomeId = 'nearTransactionOutcomeId',
}

export default {
	entityType: EntityType.NearExecutionOutcome,

	label: 'NEAR Execution Outcome',
	labelPlural: 'NEAR Execution Outcomes',

	selectors: [
		{
			name: NearExecutionOutcomeSelector.NearTransactionOutcomeId,
			fields: [
				'$transaction',
				'outcomeId',
			],
		},
	],

	fields: [
		{
			name: '$transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'outcomeId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
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
