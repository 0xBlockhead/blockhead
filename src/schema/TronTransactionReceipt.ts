// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TronTransactionReceipt,
	labels: {
		singular: 'tron transaction receipt',
		plural: 'tron transaction receipts',
	},
})({
	$transaction: {
		entityType: EntityType.TronTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	feeSun: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
			Source.TronFullNode_Rest,
			Source.TronSolidityNode_Rest,
			Source.TronScan_Rest,
		],
	},
	result: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
			Source.TronFullNode_Rest,
			Source.TronSolidityNode_Rest,
			Source.TronScan_Rest,
		],
	},
	resMessageHex: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	energyUsage: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	originEnergyUsage: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	energyUsageTotal: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
			Source.TronFullNode_Rest,
			Source.TronSolidityNode_Rest,
		],
	},
	energyFeeSun: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	energyPenaltyTotal: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	netUsage: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
			Source.TronFullNode_Rest,
			Source.TronSolidityNode_Rest,
		],
	},
	netFeeSun: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	internalTransactionCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractResultHex: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.TronGrid_Rest,
			Source.TronFullNode_Rest,
			Source.TronSolidityNode_Rest,
		],
	},
})({
	selectors: {
		Transaction: [
			'$transaction',
		],
	},
})
