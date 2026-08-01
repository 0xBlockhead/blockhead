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
		label: 'network',
		entityType: EntityType.AptosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	transactionVersion: {
		label: 'transaction version',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	eventIndex: {
		label: 'event index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	eventType: {
		label: 'event type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountAddress: {
		label: 'account address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	creationNumber: {
		label: 'creation number',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	sequenceNumber: {
		label: 'sequence number',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		label: 'transaction',
		entityType: EntityType.AptosTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
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
