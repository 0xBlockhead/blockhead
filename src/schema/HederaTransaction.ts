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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	consensusTimestamp: {
		label: 'consensus timestamp',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionId: {
		label: 'transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nonce: {
		label: 'nonce',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionType: {
		label: 'transaction type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	payerAccount: {
		label: 'payer account',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	result: {
		label: 'result',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	chargedTxFeeTinybar: {
		label: 'charged transaction fee tinybar',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validStartTimestamp: {
		label: 'valid start timestamp',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nodeAccountId: {
		label: 'node account ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scheduled: {
		label: 'scheduled',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$block: {
		label: 'block',
		entityType: EntityType.HederaBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$schedule: {
		label: 'schedule',
		entityType: EntityType.HederaSchedule,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$hbarTransfers: {
		label: 'hbar transfers',
		entityType: EntityType.HederaHbarTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenTransfers: {
		label: 'token transfers',
		entityType: EntityType.HederaTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$contractResults: {
		label: 'contract results',
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
