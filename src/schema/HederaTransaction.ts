// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaTransaction,
	labels: {
		singular: 'hedera transaction',
		plural: 'hedera transactions',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	consensusTimestamp: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nonce: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	payerAccount: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	result: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	chargedTxFeeTinybar: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validStartTimestamp: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nodeAccountId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scheduled: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$block: {
		entityType: EntityType.HederaBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$schedule: {
		entityType: EntityType.HederaSchedule,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$hbarTransfers: {
		entityType: EntityType.HederaHbarTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenTransfers: {
		entityType: EntityType.HederaTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$contractResults: {
		entityType: EntityType.HederaContractResult,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkConsensusTimestamp: [
			'$network',
			'consensusTimestamp',
		],
		NetworkTransactionIdNonce: [
			'$network',
			'transactionId',
			'nonce',
		],
	},
})
