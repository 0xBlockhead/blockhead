// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoBlock,
		cardinality: EntityFieldCardinality.One,
	},
	hogExTransactionId: {
		label: 'hog ex transaction ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	kernelRoot: {
		label: 'kernel root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
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
