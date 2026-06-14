import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum SolanaInstructionSelector {
	SolanaTransactionInstructionIndexInnerInstructionIndex = 'solanaTransactionInstructionIndexInnerInstructionIndex',
}

export default {
	entityType: EntityType.SolanaInstruction,

	label: 'Solana Instruction',
	labelPlural: 'Solana Instructions',

	selectors: [
		{
			name: SolanaInstructionSelector.SolanaTransactionInstructionIndexInnerInstructionIndex,
			fields: [
				'$transaction',
				'instructionIndex',
				'innerInstructionIndex',
			],
		},
	],

	fields: [
		{
			name: '$transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'instructionIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'innerInstructionIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
			name: '$$accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
