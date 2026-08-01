// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosTokenTransfer,
	labels: {
		singular: 'tezos token transfer',
		plural: 'tezos token transfers',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	transferId: {
		label: 'transfer ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$token: {
		label: 'token',
		entityType: EntityType.TezosToken,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$from: {
		label: 'from',
		entityType: EntityType.TezosAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$to: {
		label: 'to',
		entityType: EntityType.TezosAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operation: {
		label: 'operation',
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	level: {
		label: 'level',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractAddress: {
		label: 'contract address',
		description: 'The contract address on its network.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenId: {
		label: 'Token ID',
		description: 'The token identifier within its collection or contract.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	standard: {
		label: 'standard',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionId: {
		label: 'transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkTransferIdSource: [
			'$network',
			'transferId',
			'source',
		],
	},
})
