// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitcoinCashCashTokenCategorySelector {
	NetworkCategoryId = 'NetworkCategoryId',
}
export default {
	entityType: EntityType.BitcoinCashCashTokenCategory,
	label: 'Bitcoin Cash CashToken category',
	labelPlural: 'Bitcoin Cash CashToken categories',
	selectors: [
		{
			name: BitcoinCashCashTokenCategorySelector.NetworkCategoryId,
			fields: [
				'$network',
				'categoryId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'categoryId',
			label: 'Category ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
