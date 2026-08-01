// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BridgeTransfer,
	labels: {
		singular: 'bridge transfer',
		plural: 'bridge transfers',
	},
})({
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transferId: {
		label: 'transfer ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$sourceTx: {
		label: 'source tx',
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logIndex: {
		label: 'log index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$destinationTx: {
		label: 'destination tx',
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$sender: {
		label: 'sender',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$recipient: {
		label: 'recipient',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$fromNetwork: {
		label: 'from network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$toNetwork: {
		label: 'to network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$fromToken: {
		label: 'from token',
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$toToken: {
		label: 'to token',
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountIn: {
		label: 'amount in',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountOut: {
		label: 'amount out',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	railId: {
		label: 'rail ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	settlementModel: {
		label: 'settlement model',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationModel: {
		label: 'verification model',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetOutcome: {
		label: 'asset outcome',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BridgeTransfer_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SourceTransferId: [
			'source',
			'transferId',
		],
		SourceTxSourceLogIndex: [
			'$sourceTx',
			'source',
			'logIndex',
		],
	},
})
