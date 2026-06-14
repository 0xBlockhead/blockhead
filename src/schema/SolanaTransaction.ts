import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum SolanaTransactionSelector {
	NetworkSignature = 'networkSignature',
}

export default {
	entityType: EntityType.SolanaTransaction,

	label: 'Solana Transaction',
	labelPlural: 'Solana Transactions',

	selectors: [
		{
			name: SolanaTransactionSelector.NetworkSignature,
			fields: [
				'$network',
				'signature',
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
			name: 'signature',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$feePayer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'slot',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeLamports',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'computeUnitsConsumed',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$instructions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaInstruction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
