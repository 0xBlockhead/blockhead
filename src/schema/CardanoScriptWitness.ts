// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CardanoScriptWitness,
	labels: {
		singular: 'cardano script witness',
		plural: 'cardano script witnesses',
	},
})({
	$transaction: {
		label: 'transaction',
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	witnessIndex: {
		label: 'witness index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	scriptKind: {
		label: 'script kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	language: {
		label: 'language',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scriptHash: {
		label: 'script hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datum: {
		label: 'datum',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	redeemer: {
		label: 'redeemer',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	executionUnits: {
		label: 'execution units',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionWitnessIndex: [
			'$transaction',
			'witnessIndex',
		],
	},
})
