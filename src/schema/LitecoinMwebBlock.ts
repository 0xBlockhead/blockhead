// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LitecoinMwebBlockSelector {
	UtxoBlock = 'UtxoBlock',
}
export default {
	entityType: EntityType.LitecoinMwebBlock,
	label: 'litecoin MWEB block',
	labelPlural: 'litecoin MWEB blocks',
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
				label: 'block',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.UtxoBlock,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'hogExTransactionId',
				label: 'hog ex transaction ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'kernelRoot',
				label: 'kernel root',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$transactions',
				label: 'transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LitecoinMwebTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
