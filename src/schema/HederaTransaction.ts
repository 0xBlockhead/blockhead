// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	consensusTimestamp: {
		label: 'consensus timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionId: {
		label: 'transaction ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nonce: {
		label: 'nonce',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionType: {
		label: 'transaction type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	payerAccount: {
		label: 'payer account',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	result: {
		label: 'result',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	chargedTxFeeTinybar: {
		label: 'charged transaction fee tinybar',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validStartTimestamp: {
		label: 'valid start timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nodeAccountId: {
		label: 'node account ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scheduled: {
		label: 'scheduled',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$block: {
		label: 'block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$schedule: {
		label: 'schedule',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaSchedule,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$hbarTransfers: {
		label: 'hbar transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaHbarTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenTransfers: {
		label: 'token transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$contractResults: {
		label: 'contract results',
		type: EntityFieldType.EntitiesReference,
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
