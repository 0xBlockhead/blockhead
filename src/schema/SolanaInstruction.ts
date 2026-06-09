import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Transaction from '$/schema/SolanaTransaction.ts'

export default {
	entityType: EntityType.SolanaInstruction,

	label: 'Solana Instruction',
	labelPlural: 'Solana Instructions',

	id: type({
		$transaction: Transaction.id,
		instructionIndex: 'number',
		'innerInstructionIndex?': 'number',
	}),

	fields: [
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
