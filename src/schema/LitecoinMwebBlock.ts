import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import UtxoBlock from '$/schema/UtxoBlock.ts'

export enum LitecoinMwebBlockSelector {
	UtxoBlock = 'utxoBlock',
}

export default {
	entityType: EntityType.LitecoinMwebBlock,

	label: 'Litecoin MWEB Block',
	labelPlural: 'Litecoin MWEB Blocks',

	selectors: [
		{
			name: LitecoinMwebBlockSelector.UtxoBlock,
			fields: [
				'$block',
			],
		},
	],

	fields: [
		{
			name: '$block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoBlock,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hogExTransactionId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'kernelRoot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LitecoinMwebTransaction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
