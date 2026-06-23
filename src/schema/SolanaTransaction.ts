import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum SolanaTransactionSelector {
	NetworkSignature = 'networkSignature',
}
export default {
	entityType: EntityType.SolanaTransaction,
	label: 'solana transaction',
	labelPlural: 'solana transactions',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'signature',
			label: 'signature',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$block',
			label: 'block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$feePayer',
			label: 'fee payer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaTransaction_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$instructions',
			label: 'instructions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaInstruction,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
