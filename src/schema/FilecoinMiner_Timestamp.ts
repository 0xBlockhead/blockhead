// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FilecoinMiner_Timestamp,
	labels: {
		singular: 'filecoin miner timestamp',
		plural: 'filecoin miner observations',
	},
})({
	$miner: {
		label: 'Miner',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinMiner,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	height: {
		label: 'Height',
		description: 'The block height.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	tipsetKey: {
		label: 'Tipset key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$tipset: {
		label: 'Tipset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinTipset,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	$owner: {
		label: 'Owner',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	$worker: {
		label: 'Worker',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	peerId: {
		label: 'Peer ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	rawBytePower: {
		label: 'Raw byte power',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	qualityAdjustedPower: {
		label: 'Quality adjusted power',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	networkRawBytePower: {
		label: 'Network raw byte power',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	networkQualityAdjustedPower: {
		label: 'Network quality adjusted power',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	activeSectorCount: {
		label: 'Active sectors',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	liveSectorCount: {
		label: 'Live sectors',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	faultySectorCount: {
		label: 'Faulty sectors',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
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
