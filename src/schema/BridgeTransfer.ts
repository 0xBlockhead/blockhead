// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BridgeTransfer,
	labels: {
		singular: 'bridge transfer',
		plural: 'bridge transfers',
	},
})({
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transferId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	originChainId: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	depositId: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$sourceTx: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$destinationTx: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$sender: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$recipient: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$fromNetwork: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$toNetwork: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$fromToken: {
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$toToken: {
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountIn: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountOut: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	railId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	settlementModel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationModel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetOutcome: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Across_Rest,
			Source.Axelarscan_Rest,
		],
	},
	bridgeFeeUsd: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Across_Rest,
		],
	},
	exclusiveRelayer: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Across_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.BridgeTransfer_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Across_Rest,
			Source.Axelarscan_Rest,
		],
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
		OriginChainIdDepositId: [
			'originChainId',
			'depositId',
		],
	},
})
