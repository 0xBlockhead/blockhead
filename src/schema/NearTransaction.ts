import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum NearTransactionSelector {
	NetworkHash = 'networkHash',
	NetworkHashSignerAccountId = 'networkHashSignerAccountId',
}

export default {
	entityType: EntityType.NearTransaction,

	label: 'NEAR Transaction',
	labelPlural: 'NEAR Transactions',

	selectors: [
		{
			name: NearTransactionSelector.NetworkHash,
			fields: [
				'$network',
				'hash',
			],
		},
		{
			name: NearTransactionSelector.NetworkHashSignerAccountId,
			fields: [
				'$network',
				'hash',
				'signerAccountId',
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
			name: 'hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'signerAccountId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$signer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$receiver',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$actions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearAction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$executionOutcomes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearExecutionOutcome,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
