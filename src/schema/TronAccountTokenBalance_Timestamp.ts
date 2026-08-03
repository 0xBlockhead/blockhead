// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const tronScanRestSources = [
	Source.TronScan_Rest,
] as const

export default entity({
	entityType: EntityType.TronAccountTokenBalance_Timestamp,
	labels: {
		singular: 'tron account token balance timestamp',
		plural: 'tron account token balance observations',
	},
})({
	$account: {
		entityType: EntityType.TronAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$token: {
		entityType: EntityType.TronToken,
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
	standard: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	balance: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	ownedSerialNumbers: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.Many,
	},
	tokenId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	tokenName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	tokenSymbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	frozenBalance: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegatedBalance: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountTokenTimestampMsSource: [
			'$account',
			'$token',
			'timestampMs',
			'source',
		],
	},
})
