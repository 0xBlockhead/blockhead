// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitcoinCashCashTokenCategorySelector {
	NetworkCategoryId = 'NetworkCategoryId',
}
export const BitcoinCashCashTokenCategory = entity({
	entityType: EntityType.BitcoinCashCashTokenCategory,
	label: 'Bitcoin Cash CashToken category',
	labelPlural: 'Bitcoin Cash CashToken categories',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	categoryId: {
		label: 'Category ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		NetworkCategoryId: [
			'$network',
			'categoryId',
		],
	},
})
