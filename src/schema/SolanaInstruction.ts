// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	indexInInstruction: {
		label: 'Index in instruction',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
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
