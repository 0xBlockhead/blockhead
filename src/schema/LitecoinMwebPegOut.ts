import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum LitecoinMwebPegOutSelector {
	LitecoinMwebTransactionPegOutIndex = 'litecoinMwebTransactionPegOutIndex',
}

export default {
	entityType: EntityType.LitecoinMwebPegOut,

	label: 'Litecoin MWEB Peg-out',
	labelPlural: 'Litecoin MWEB Peg-outs',

	selectors: [
		{
			name: LitecoinMwebPegOutSelector.LitecoinMwebTransactionPegOutIndex,
			fields: [
				'$transaction',
				'pegOutIndex',
			],
		},
	],

	fields: [
		{
			name: '$transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LitecoinMwebTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pegOutIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$transparentOutput',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoOutput,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amountLitoshis',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
