// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StarknetEvent,
	labels: {
		singular: 'starknet event',
		plural: 'starknet events',
	},
})({
	$transaction: {
		entityType: EntityType.StarknetTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	eventIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$fromContract: {
		entityType: EntityType.StarknetContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	keys: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	data: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		TransactionEventIndex: [
			'$transaction',
			'eventIndex',
		],
	},
})
