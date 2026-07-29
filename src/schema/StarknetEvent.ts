// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StarknetTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	eventIndex: {
		label: 'event index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$fromContract: {
		label: 'from contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StarknetContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	keys: {
		label: 'keys',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	data: {
		label: 'data',
		type: EntityFieldType.Primitive,
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
