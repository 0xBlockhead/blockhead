import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum LitecoinMwebPegInSelector {
	LitecoinMwebTransactionPegInIndex = 'litecoinMwebTransactionPegInIndex',
}

export default {
	entityType: EntityType.LitecoinMwebPegIn,

	label: 'Litecoin MWEB Peg-in',
	labelPlural: 'Litecoin MWEB Peg-ins',

	selectors: [
		{
			name: LitecoinMwebPegInSelector.LitecoinMwebTransactionPegInIndex,
			fields: [
				'$transaction',
				'pegInIndex',
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
			name: 'pegInIndex',
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
