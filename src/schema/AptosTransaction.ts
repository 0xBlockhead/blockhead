// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AptosTransaction,
	labels: {
		singular: 'aptos transaction',
		plural: 'aptos transactions',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.AptosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	version: {
		label: 'version',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionKind: {
		label: 'transaction kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sender: {
		label: 'sender',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.AptosTransaction_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$stateChanges: {
		label: 'state changes',
		entityType: EntityType.AptosStateChange,
		cardinality: EntityFieldCardinality.Many,
	},
	$$events: {
		label: 'events',
		entityType: EntityType.AptosEvent,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkVersion: [
			'$network',
			'version',
		],
		NetworkHash: [
			'$network',
			'hash',
		],
	},
})
