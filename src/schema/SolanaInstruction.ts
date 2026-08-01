// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { SolanaInstructionKind } from '$/schema/SolanaInstructionKind.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SolanaInstruction,
	labels: {
		singular: 'solana instruction',
		plural: 'Solana instructions',
	},
})({
	$transaction: {
		label: 'Transaction',
		entityType: EntityType.SolanaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	instructionKind: {
		label: 'Instruction kind',
		primitiveType: type.enumerated(...Object.values(SolanaInstructionKind)),
		cardinality: EntityFieldCardinality.One,
	},
	indexInTransaction: {
		label: 'Index in transaction',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	indexInInstruction: {
		label: 'Index in instruction',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$program: {
		label: 'Program',
		entityType: EntityType.SolanaProgram,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parsedType: {
		label: 'Parsed type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	data: {
		label: 'Data',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stackHeight: {
		label: 'Stack height',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$accounts: {
		label: 'Accounts',
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
