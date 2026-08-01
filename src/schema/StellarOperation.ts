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
		label: 'transaction',
		entityType: EntityType.StellarTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	operationIndex: {
		label: 'operation index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	operationType: {
		label: 'operation type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceAccount: {
		label: 'source account',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	body: {
		label: 'body',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resultCode: {
		label: 'result code',
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
