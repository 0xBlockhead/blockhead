// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StellarOperation,
	labels: {
		singular: 'stellar operation',
		plural: 'stellar operations',
	},
})({
	$transaction: {
		entityType: EntityType.StellarTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	operationIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	operationType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceAccount: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	body: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resultCode: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionOperationIndex: [
			'$transaction',
			'operationIndex',
		],
	},
})
