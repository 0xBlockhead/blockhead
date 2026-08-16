// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitcoinMiningPool_Timestamp,
	labels: {
		singular: 'Bitcoin mining pool observation',
		plural: 'Bitcoin mining pool observations',
	},
	description: 'A source-scoped observation of one mining pool\'s attributed block counts, shares, and hashrate. Rolling 24h and 1w windows are as-of this observation clock, not stable pool identity.',
})({
	$pool: {
		entityType: EntityType.BitcoinMiningPool,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockCountAll: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
	blockCount24h: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
	blockCount1w: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
	blockShareAll: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
	blockShare24h: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
	blockShare1w: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
	estimatedHashrateHashesPerSecond: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
	reportedHashrateHashesPerSecond: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
	avgBlockHealth: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
	totalRewardSats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
})({
	selectors: {
		PoolTimestampMsSource: [
			'$pool',
			'timestampMs',
			'source',
		],
	},
})
