// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TonNftTransfer,
	labels: {
		singular: 'ton NFT transfer',
		plural: 'ton NFT transfers',
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
	$item: {
		label: 'item',
		entityType: EntityType.TonNftItem,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$collection: {
		label: 'collection',
		entityType: EntityType.TonNftCollection,
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
	queryId: {
		label: 'query ID',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	forwardAmountNano: {
		label: 'forward amount nano',
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
