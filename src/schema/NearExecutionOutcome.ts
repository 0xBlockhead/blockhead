// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearExecutionOutcomeSelector {
	NearTransactionOutcomeId = 'NearTransactionOutcomeId',
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
			label: 'Transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'outcomeId',
			label: 'Outcome ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'status',
			label: 'Status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'gasBurnt',
			label: 'Gas burnt',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: '$$receipts',
			label: 'Receipts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearReceipt,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
	],
} as const satisfies EntityDefinition
