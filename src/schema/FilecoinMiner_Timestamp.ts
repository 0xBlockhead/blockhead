// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FilecoinMiner_TimestampSelector {
	MinerTimestampMsSource = 'MinerTimestampMsSource',
}
export default {
	entityType: EntityType.FilecoinMiner_Timestamp,
	label: 'filecoin miner timestamp',
	labelPlural: 'filecoin miner observations',
	selectors: [
		{
			name: FilecoinMiner_TimestampSelector.MinerTimestampMsSource,
			fields: [
				'$miner',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$miner',
				label: 'Miner',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FilecoinMiner,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'height',
				label: 'Height',
				description: 'The block height.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'tipsetKey',
				label: 'Tipset key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$tipset',
				label: 'Tipset',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FilecoinTipset,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$owner',
				label: 'Owner',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FilecoinActor,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: '$worker',
				label: 'Worker',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FilecoinActor,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'peerId',
				label: 'Peer ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'rawBytePower',
				label: 'Raw byte power',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'qualityAdjustedPower',
				label: 'Quality adjusted power',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'networkRawBytePower',
				label: 'Network raw byte power',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'networkQualityAdjustedPower',
				label: 'Network quality adjusted power',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'liveSectorCount',
				label: 'Live sectors',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'faultySectorCount',
				label: 'Faulty sectors',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
