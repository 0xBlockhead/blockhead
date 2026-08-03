// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const tronGridRestTronFullNodeRestTronSolidityNodeRestSources = [
	Source.TronGrid_Rest,
	Source.TronFullNode_Rest,
	Source.TronSolidityNode_Rest,
] as const
const tronGridRestSources = [
	Source.TronGrid_Rest,
] as const

export default entity({
	entityType: EntityType.TronBlock,
	labels: {
		singular: 'tron block',
		plural: 'tron blocks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	height: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$parent: {
		entityType: EntityType.TronBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
			Source.TronFullNode_Rest,
			Source.TronSolidityNode_Rest,
			Source.TronScan_Rest,
		],
	},
	parentHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestSources,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
			Source.TronFullNode_Rest,
			Source.TronSolidityNode_Rest,
			Source.TronScan_Rest,
			Source.ThreeXpl_Rest,
		],
	},
	$witness: {
		entityType: EntityType.TronWitness,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	txTrieRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	version: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	transactionCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
			Source.TronScan_Rest,
		],
	},
	$$transactions: {
		entityType: EntityType.TronTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: tronGridRestTronFullNodeRestTronSolidityNodeRestSources,
	},
})({
	selectors: {
		NetworkHeight: [
			'$network',
			'height',
		],
		NetworkHeightHash: [
			'$network',
			'height',
			'hash',
		],
	},
})
