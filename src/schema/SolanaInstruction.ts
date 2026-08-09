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
		entityType: EntityType.SolanaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	instructionKind: {
		primitiveType: type.enumerated(...Object.values(SolanaInstructionKind)),
		cardinality: EntityFieldCardinality.One,
	},
	indexInTransaction: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	indexInInstruction: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$program: {
		entityType: EntityType.SolanaProgram,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parsedType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	data: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stackHeight: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$accounts: {
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
