import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum LitecoinMwebTransactionSelector {
	LitecoinMwebBlockTransactionIndex = 'litecoinMwebBlockTransactionIndex',
}

export default {
	entityType: EntityType.LitecoinMwebTransaction,

	label: 'Litecoin MWEB Transaction',
	labelPlural: 'Litecoin MWEB Transactions',

	selectors: [
		{
			name: LitecoinMwebTransactionSelector.LitecoinMwebBlockTransactionIndex,
			fields: [
				'$mwebBlock',
				'transactionIndex',
			],
		},
	],

	fields: [
		{
			name: '$mwebBlock',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LitecoinMwebBlock,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'kernelOffset',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$outputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LitecoinMwebOutput,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$pegIns',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LitecoinMwebPegIn,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$pegOuts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LitecoinMwebPegOut,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
