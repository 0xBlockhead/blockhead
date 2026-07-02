// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SolanaInstructionKind {
	Instruction = 'Instruction',
	InnerInstruction = 'InnerInstruction',
}
export enum SolanaInstructionSelector {
	SolanaTransactionIndexInTransaction = 'SolanaTransactionIndexInTransaction',
	SolanaTransactionIndexInInstruction = 'SolanaTransactionIndexInInstruction',
}
export default {
	entityType: EntityType.SolanaInstruction,
	label: 'solana instruction',
	labelPlural: 'Solana instructions',
	selectors: [
		{
			name: SolanaInstructionSelector.SolanaTransactionIndexInTransaction,
			fields: [
				'$transaction',
				'instructionKind',
				'indexInTransaction',
			],
		},
		{
			name: SolanaInstructionSelector.SolanaTransactionIndexInInstruction,
			fields: [
				'$transaction',
				'instructionKind',
				'indexInTransaction',
				'indexInInstruction',
			],
		},
	],
	fields: [
		{
				name: '$transaction',
				label: 'Transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SolanaTransaction,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'instructionKind',
				label: 'Instruction kind',
				type: EntityFieldType.Primitive,
				primitiveType: type.enumerated(...Object.values(SolanaInstructionKind)),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'indexInTransaction',
				label: 'Index in transaction',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'indexInInstruction',
				label: 'Index in instruction',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$program',
				label: 'Program',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SolanaProgram,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'parsedType',
				label: 'Parsed type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'data',
				label: 'Data',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'stackHeight',
				label: 'Stack height',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$accounts',
				label: 'Accounts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SolanaAccount,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
