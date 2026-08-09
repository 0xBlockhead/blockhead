// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AptosEvent,
	labels: {
		singular: 'aptos event',
		plural: 'aptos events',
	},
})({
	$network: {
		entityType: EntityType.AptosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	transactionVersion: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	eventIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	eventType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	creationNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	sequenceNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		entityType: EntityType.AptosTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	value: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkTransactionVersionEventIndex: [
			'$network',
			'transactionVersion',
			'eventIndex',
		],
	},
})
