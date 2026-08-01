// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TonJettonTransfer,
	labels: {
		singular: 'ton jetton transfer',
		plural: 'ton jetton transfers',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
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
	$jetton: {
		label: 'jetton',
		entityType: EntityType.TonJetton,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$from: {
		label: 'from',
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$to: {
		label: 'to',
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$trace: {
		label: 'trace',
		entityType: EntityType.TonTrace,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$message: {
		label: 'message',
		entityType: EntityType.TonMessage,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionLt: {
		label: 'transaction lt',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionHash: {
		label: 'transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountNano: {
		label: 'amount nano',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	queryId: {
		label: 'query ID',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	forwardTonAmountNano: {
		label: 'forward ton amount nano',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseDestination: {
		label: 'response destination',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	customPayloadHash: {
		label: 'custom payload hash',
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
