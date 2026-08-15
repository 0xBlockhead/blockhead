// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MevRelay_ProposerPayloadDelivered,
	labels: {
		singular: 'MEV relay proposer payload delivered',
		plural: 'MEV relay proposer payloads delivered',
	},
	description: 'A relay-scoped report that a payload was delivered to a proposer. Delivery is not consensus finality.',
})({
	$relay: {
		entityType: EntityType.MevRelay,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	blockHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	$builder: {
		entityType: EntityType.MevBuilder,
		cardinality: EntityFieldCardinality.One,
	},
	value: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	$executionBlock: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RelaySlotBlockHash: [
			'$relay',
			'slot',
			'blockHash',
		],
	},
})
