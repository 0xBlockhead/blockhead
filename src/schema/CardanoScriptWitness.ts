// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoScriptWitnessSelector {
	TransactionWitnessIndex = 'TransactionWitnessIndex',
}
export default {
	entityType: EntityType.CardanoScriptWitness,
	label: 'cardano script witness',
	labelPlural: 'cardano script witnesses',
	selectors: [
		{
			name: CardanoScriptWitnessSelector.TransactionWitnessIndex,
			fields: [
				'$transaction',
				'witnessIndex',
			],
		},
	],
	fields: [
		{
				name: '$transaction',
				label: 'transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CardanoTransaction,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'witnessIndex',
				label: 'witness index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'scriptKind',
				label: 'script kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'language',
				label: 'language',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'scriptHash',
				label: 'script hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'datum',
				label: 'datum',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'redeemer',
				label: 'redeemer',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'executionUnits',
				label: 'execution units',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
