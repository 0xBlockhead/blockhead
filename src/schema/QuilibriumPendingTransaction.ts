import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum QuilibriumPendingTransactionSelector {
	NetworkTransactionHash = 'networkTransactionHash',
}

export default {
	entityType: EntityType.QuilibriumPendingTransaction,

	label: 'Quilibrium Pending Transaction',
	labelPlural: 'Quilibrium Pending Transactions',

	selectors: [
		{
			name: QuilibriumPendingTransactionSelector.NetworkTransactionHash,
			fields: [
				'$network',
				'transactionHash',
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
			name: 'transactionHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.QuilibriumAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionType',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
