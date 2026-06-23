import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum SolanaInstructionKind {
	Instruction = 'instruction',
	InnerInstruction = 'innerInstruction',
}
export enum SolanaInstructionSelector {
	SolanaTransactionInstruction = 'solanaTransactionInstruction',
	TransactionInstructionKindInstructionIndex = '$transaction+instructionKind+instructionIndex',
	SolanaTransactionInnerInstruction = 'solanaTransactionInnerInstruction',
	TransactionInstructionKindInstructionIndexInnerInstructionIndex = '$transaction+instructionKind+instructionIndex+innerInstructionIndex',
}
export default {
	entityType: EntityType.SolanaInstruction,
	label: 'solana instruction',
	labelPlural: 'solana instructions',
	selectors: [
		{
			name: SolanaInstructionSelector.SolanaTransactionInstruction,
			fields: [
				'$transaction',
				'instructionKind',
				'instructionIndex',
			],
		},
		{
			name: SolanaInstructionSelector.SolanaTransactionInnerInstruction,
			fields: [
				'$transaction',
				'instructionKind',
				'instructionIndex',
				'innerInstructionIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'instructionKind',
			label: 'instruction kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'instructionIndex',
			label: 'instruction index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'innerInstructionIndex',
			label: 'inner instruction index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$program',
			label: 'program',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaProgram,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'parsedType',
			label: 'parsed type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'data',
			label: 'data',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'stackHeight',
			label: 'stack height',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$accounts',
			label: 'accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
