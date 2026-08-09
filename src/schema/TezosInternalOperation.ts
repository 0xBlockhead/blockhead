// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosInternalOperation,
	labels: {
		singular: 'tezos internal operation',
		plural: 'tezos internal operations',
	},
})({
	$parentOperation: {
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.One,
	},
	internalIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	operationKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	destinationAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountMutez: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nonce: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parameters: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resultStatus: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	consumedGas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ParentOperationInternalIndex: [
			'$parentOperation',
			'internalIndex',
		],
	},
})
