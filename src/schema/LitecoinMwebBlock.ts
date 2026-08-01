// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LitecoinMwebBlock,
	labels: {
		singular: 'litecoin MWEB block',
		plural: 'litecoin MWEB blocks',
	},
})({
	$block: {
		label: 'block',
		entityType: EntityType.UtxoBlock,
		cardinality: EntityFieldCardinality.One,
	},
	hogExTransactionId: {
		label: 'hog ex transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	kernelRoot: {
		label: 'kernel root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.LitecoinMwebTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		UtxoBlock: [
			'$block',
		],
	},
})
