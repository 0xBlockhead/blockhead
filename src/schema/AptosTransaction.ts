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
		entityType: EntityType.AptosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	version: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sender: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.AptosTransaction_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$stateChanges: {
		entityType: EntityType.AptosStateChange,
		cardinality: EntityFieldCardinality.Many,
	},
	$$events: {
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
