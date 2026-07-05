// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FilecoinNetwork_TimestampSelector {
	NetworkTimestampMsSource = 'NetworkTimestampMsSource',
}
export default {
	entityType: EntityType.FilecoinNetwork_Timestamp,
	label: 'filecoin network timestamp',
	labelPlural: 'filecoin network observations',
	selectors: [
		{
			name: FilecoinNetwork_TimestampSelector.NetworkTimestampMsSource,
			fields: [
				'$network',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
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
				name: 'headHeight',
				label: 'Head height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'headTipsetKey',
				label: 'Head tipset key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'headBlockCount',
				label: 'Head block count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'headTimestampMs',
				label: 'Head timestamp',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: '$headTipset',
				label: 'Head tipset',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FilecoinTipset,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: '$$headMiners',
				label: 'Head miners',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.FilecoinMiner,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'networkVersion',
				label: 'Network version',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'lotusVersion',
				label: 'Lotus version',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'lotusAgent',
				label: 'Lotus agent',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'blockDelaySeconds',
				label: 'Block delay seconds',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'totalRawBytePower',
				label: 'Total raw byte power',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'totalQualityAdjustedPower',
				label: 'Total quality adjusted power',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition
