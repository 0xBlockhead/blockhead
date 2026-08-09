// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadAvalancheNodeState_Timestamp,
	labels: {
		singular: 'blockhead avalanche node state timestamp',
		plural: 'blockhead avalanche node state observations',
	},
})({
	$nodeState: {
		entityType: EntityType.BlockheadAvalancheNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.AvalancheInfo_JsonRpc,
		],
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.AvalancheInfo_JsonRpc,
		],
	},
	networkName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalancheInfo_JsonRpc,
		],
	},
	nodeVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalancheInfo_JsonRpc,
		],
	},
	databaseVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalancheInfo_JsonRpc,
		],
	},
	gitCommit: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalancheInfo_JsonRpc,
		],
	},
	rpcProtocolVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalancheInfo_JsonRpc,
		],
	},
	connectedPeerCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalancheInfo_JsonRpc,
		],
	},
	uptimePercent: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalancheInfo_JsonRpc,
		],
	},
	vmVersions: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalancheInfo_JsonRpc,
		],
	},
	lastSyncedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NodeStateTimestampMsSource: [
			'$nodeState',
			'timestampMs',
			'source',
		],
	},
})
