import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum NearExecutionOutcomeSelector {
	NearTransactionOutcomeId = 'nearTransactionOutcomeId',
	TransactionOutcomeId = '$transaction+outcomeId',
}
export default {
	entityType: EntityType.NearExecutionOutcome,
	label: 'near execution outcome',
	labelPlural: 'near execution outcomes',
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
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'outcomeId',
			label: 'outcome ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasBurnt',
			label: 'gas burnt',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$receipts',
			label: 'receipts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearReceipt,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
