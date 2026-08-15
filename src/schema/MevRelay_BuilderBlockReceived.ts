// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MevRelay_BuilderBlockReceived,
	labels: {
		singular: 'MEV relay builder block received',
		plural: 'MEV relay builder blocks received',
	},
	description: 'A relay-scoped report that a builder block candidate was received. It is not a consensus bid and not a canonical execution block.',
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
	receivedAtMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	parentHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	proposerPubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	proposerFeeRecipient: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	valueWei: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	gasLimit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	gasUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionCount: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	optimisticSubmission: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RelaySlotBuilderBlockHashReceivedAtMs: [
			'$relay',
			'slot',
			'$builder',
			'blockHash',
			'receivedAtMs',
		],
	},
})
