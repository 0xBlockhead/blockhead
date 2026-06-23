import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum NearTransactionSelector {
	NetworkHash = 'networkHash',
	NetworkHashSignerAccountId = 'networkHashSignerAccountId',
}
export default {
	entityType: EntityType.NearTransaction,
	label: 'near transaction',
	labelPlural: 'near transactions',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'signerAccountId',
			label: 'signer account ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$signer',
			label: 'signer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$receiver',
			label: 'receiver',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nonce',
			label: 'nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$actions',
			label: 'actions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearAction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$executionOutcomes',
			label: 'execution outcomes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearExecutionOutcome,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
