// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SolanaTransactionSelector {
	NetworkSignature = 'NetworkSignature',
}
export default {
	entityType: EntityType.SolanaTransaction,
	label: 'solana transaction',
	labelPlural: 'Solana transactions',
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
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'signature',
				label: 'Signature',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$block',
				label: 'Block',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SolanaBlock,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$feePayer',
				label: 'Fee payer',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SolanaAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'slot',
				label: 'Slot',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'feeLamports',
				label: 'Fee',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'computeUnitsConsumed',
				label: 'Compute units consumed',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'status',
				label: 'Status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SolanaTransaction_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$instructions',
				label: 'Instructions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SolanaInstruction,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
