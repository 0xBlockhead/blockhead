import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	conditionalOn,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum SolanaInstructionKind {
	Instruction = 'instruction',
	InnerInstruction = 'innerInstruction',
}

export enum SolanaInstructionSelector {
	SolanaTransactionInstruction = 'solanaTransactionInstruction',
	SolanaTransactionInnerInstruction = 'solanaTransactionInnerInstruction',
}

const solanaInstructionKindField = {
	name: 'instructionKind',
	type: EntityFieldType.Primitive,
	primitiveType: type.enumerated(
		SolanaInstructionKind.Instruction,
		SolanaInstructionKind.InnerInstruction
	),
	cardinality: EntityFieldCardinality.One,
} as const satisfies EntityFieldDefinition

const solanaInstructionFields = [
	{
		name: '$transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	solanaInstructionKindField,
	{
		name: 'instructionIndex',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	{
		name: 'innerInstructionIndex',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		when: conditionalOn(
			[solanaInstructionKindField],
			'instructionKind',
			[
				SolanaInstructionKind.InnerInstruction,
			]
		),
	},
	{
		name: '$program',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaProgram,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	{
		name: 'parsedType',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	{
		name: 'data',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	{
		name: 'stackHeight',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	{
		name: '$$accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
] as const satisfies readonly EntityFieldDefinition[]

export default {
	entityType: EntityType.SolanaInstruction,

	label: 'Solana Instruction',
	labelPlural: 'Solana Instructions',

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

	fields: solanaInstructionFields,
} as const satisfies EntityDefinition
