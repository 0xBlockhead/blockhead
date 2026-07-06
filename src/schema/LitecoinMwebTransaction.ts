// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LitecoinMwebTransactionSelector {
	LitecoinMwebBlockTransactionIndex = 'LitecoinMwebBlockTransactionIndex',
}
export default {
	entityType: EntityType.LitecoinMwebTransaction,
	label: 'litecoin MWEB transaction',
	labelPlural: 'litecoin MWEB transactions',
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
			label: 'MWEB block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LitecoinMwebBlock,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionIndex',
			label: 'transaction index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'kernelOffset',
			label: 'kernel offset',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$outputs',
			label: 'outputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LitecoinMwebOutput,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$pegIns',
			label: 'peg ins',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LitecoinMwebPegIn,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$pegOuts',
			label: 'peg outs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LitecoinMwebPegOut,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
