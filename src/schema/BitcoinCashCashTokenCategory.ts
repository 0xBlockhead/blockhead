// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitcoinCashCashTokenCategory,
	labels: {
		singular: 'Bitcoin Cash CashToken category',
		plural: 'Bitcoin Cash CashToken categories',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	categoryId: {
		label: 'Category ID',
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
