// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const lotusJsonRpcSources = [
	Source.Lotus_JsonRpc,
] as const

export default entity({
	entityType: EntityType.FilecoinMiner_Timestamp,
	labels: {
		singular: 'filecoin miner timestamp',
		plural: 'filecoin miner observations',
	},
})({
	$miner: {
		entityType: EntityType.FilecoinMiner,
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
	height: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	tipsetKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$tipset: {
		entityType: EntityType.FilecoinTipset,
		cardinality: EntityFieldCardinality.One,
		defaultSources: lotusJsonRpcSources,
	},
	$owner: {
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	$worker: {
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	peerId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	rawBytePower: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	qualityAdjustedPower: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	networkRawBytePower: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	networkQualityAdjustedPower: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	activeSectorCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	liveSectorCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	faultySectorCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
})({
	selectors: {
		MinerHeightTipsetKeySource: [
			'$miner',
			'height',
			'tipsetKey',
			'source',
		],
	},
})
