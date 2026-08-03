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
	entityType: EntityType.TronToken,
	labels: {
		singular: 'tron token',
		plural: 'tron tokens',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	standard: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	$owner: {
		entityType: EntityType.TronAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	$contract: {
		entityType: EntityType.TronContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	createdTimestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	$$accountBalanceTimestamps: {
		entityType: EntityType.TronAccountTokenBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.TronToken_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: tronScanRestSources,
	},
})({
	selectors: {
		NetworkTokenId: [
			'$network',
			'tokenId',
		],
	},
})
