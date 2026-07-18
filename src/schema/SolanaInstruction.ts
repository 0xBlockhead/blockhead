// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum SolanaInstructionKind {
	Instruction = 'Instruction',
	InnerInstruction = 'InnerInstruction',
}
export enum SolanaInstructionSelector {
	SolanaTransactionIndexInTransaction = 'SolanaTransactionIndexInTransaction',
	SolanaTransactionIndexInInstruction = 'SolanaTransactionIndexInInstruction',
}
export const SolanaInstruction = entity({
	entityType: EntityType.SolanaInstruction,
	labels: {
		singular: 'solana instruction',
		plural: 'Solana instructions',
	},
})({
	$transaction: {
		label: 'Transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	instructionKind: {
		label: 'Instruction kind',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(SolanaInstructionKind)),
		cardinality: EntityFieldCardinality.One,
	},
	indexInTransaction: {
		label: 'Index in transaction',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	indexInInstruction: {
		label: 'Index in instruction',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$program: {
		label: 'Program',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaProgram,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parsedType: {
		label: 'Parsed type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	data: {
		label: 'Data',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stackHeight: {
		label: 'Stack height',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$accounts: {
		label: 'Accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
})({
	selectors: {
		SolanaTransactionIndexInTransaction: [
			'$transaction',
			'instructionKind',
			'indexInTransaction',
		],
		SolanaTransactionIndexInInstruction: [
			'$transaction',
			'instructionKind',
			'indexInTransaction',
			'indexInInstruction',
		],
	},
})
