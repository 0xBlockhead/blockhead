// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FinancialProtocol_Amm_EvmBlock,
	labels: {
		singular: 'AMM protocol financial observation',
		plural: 'AMM protocol financial observations',
	},
	description: 'An AMM protocol measurement at a verified EVM block under one immutable source interpretation revision. Fetch intervals are retrieval provenance, not measurement identity.',
})({
	$protocol: {
		entityType: EntityType.FinancialProtocol,
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.One,
	},
	sourceRevision: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceEntityId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	expectedManifestSchemaVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	reportedSchemaVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	implementationVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	methodologyVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	totalValueLockedUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	totalLiquidityUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	activeLiquidityUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	uncollectedProtocolSideValueUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	uncollectedSupplySideValueUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolControlledValueUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cumulativeVolumeUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativeSupplySideRevenueUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativeProtocolSideRevenueUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativeTotalRevenueUSD: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativeUniqueLPs: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativeUniqueTraders: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	totalPoolCount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativeUniqueUsers: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	openPositionCount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	cumulativePositionCount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	lastSnapshotDayID: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	lastUpdateTimestamp: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	lastUpdateBlockNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		ProtocolBlockRevision: [
			'$protocol',
			'$block',
			'sourceRevision',
		],
	},
})
