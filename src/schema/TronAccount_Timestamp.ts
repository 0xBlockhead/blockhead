// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const tronScanRestSources = [
	Source.TronScan_Rest,
] as const
const tronGridRestSources = [
	Source.TronGrid_Rest,
] as const

export default entity({
	entityType: EntityType.TronAccount_Timestamp,
	labels: {
		singular: 'tron account timestamp',
		plural: 'tron account observations',
	},
})({
	$account: {
		entityType: EntityType.TronAccount,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	balanceSun: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
			Source.TronFullNode_Rest,
			Source.TronSolidityNode_Rest,
			Source.TronScan_Rest,
		],
	},
	createdTimestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	latestOperationTimestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	totalTransactionCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	freeNetUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	freeNetLimit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	netUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	netLimit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	energyUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	energyLimit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronGridRestSources,
	},
	tronPowerUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tronPowerLimit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isContract: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
})({
	selectors: {
		AccountTimestampMsSource: [
			'$account',
			'timestampMs',
			'source',
		],
	},
})
