// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const tronGridRestTronFullNodeRestTronSolidityNodeRestTronScanRestThreeXplRestSources = [
	Source.TronGrid_Rest,
	Source.TronFullNode_Rest,
	Source.TronSolidityNode_Rest,
	Source.TronScan_Rest,
	Source.ThreeXpl_Rest,
] as const
const tronGridRestTronFullNodeRestTronSolidityNodeRestSources = [
	Source.TronGrid_Rest,
	Source.TronFullNode_Rest,
	Source.TronSolidityNode_Rest,
] as const
const tronGridRestTronFullNodeRestTronSolidityNodeRestTronScanRestSources = [
	Source.TronGrid_Rest,
	Source.TronFullNode_Rest,
	Source.TronSolidityNode_Rest,
	Source.TronScan_Rest,
] as const
const tronScanRestSources = [
	Source.TronScan_Rest,
] as const

export default entity({
	entityType: EntityType.TronTransaction,
	labels: {
		singular: 'tron transaction',
		plural: 'tron transactions',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	transactionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		entityType: EntityType.TronBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
			Source.TronFullNode_Rest,
			Source.TronScan_Rest,
			Source.ThreeXpl_Rest,
		],
	},
	blockHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestTronScanRestThreeXplRestSources,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestTronScanRestThreeXplRestSources,
	},
	expirationTimestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestSources,
	},
	contractType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestTronScanRestSources,
	},
	result: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestTronScanRestSources,
	},
	feeSun: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	$owner: {
		entityType: EntityType.TronAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestTronScanRestSources,
	},
	$to: {
		entityType: EntityType.TronAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestTronScanRestSources,
	},
	$contract: {
		entityType: EntityType.TronContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestTronScanRestSources,
	},
	amountSun: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestTronScanRestSources,
	},
	assetName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestTronScanRestSources,
	},
	rawDataHex: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestSources,
	},
	signatures: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestSources,
	},
	$receipt: {
		entityType: EntityType.TronTransactionReceipt,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestTronScanRestSources,
	},
	$$tokenTransfers: {
		entityType: EntityType.TronTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: tronScanRestSources,
	},
})({
	selectors: {
		NetworkTransactionId: [
			'$network',
			'transactionId',
		],
	},
})
