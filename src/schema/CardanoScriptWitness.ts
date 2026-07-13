// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoScriptWitnessSelector {
	TransactionWitnessIndex = 'TransactionWitnessIndex',
}
export const CardanoScriptWitness = entity({
	entityType: EntityType.CardanoScriptWitness,
	labels: {
		singular: 'cardano script witness',
		plural: 'cardano script witnesses',
	},
})({
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	witnessIndex: {
		label: 'witness index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	scriptKind: {
		label: 'script kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	language: {
		label: 'language',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scriptHash: {
		label: 'script hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datum: {
		label: 'datum',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	redeemer: {
		label: 'redeemer',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	executionUnits: {
		label: 'execution units',
		type: EntityFieldType.Primitive,
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
