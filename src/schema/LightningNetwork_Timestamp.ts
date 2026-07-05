// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum LightningNetwork_TimestampSelector {
	LightningNetworkTimestampMsSource = 'LightningNetworkTimestampMsSource',
}
export default {
	entityType: EntityType.LightningNetwork_Timestamp,
	label: 'Lightning network timestamp',
	labelPlural: 'Lightning network observations',
	selectors: [
		{
			name: LightningNetwork_TimestampSelector.LightningNetworkTimestampMsSource,
			fields: [
				'$lightningNetwork',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$lightningNetwork',
				label: 'Lightning network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LightningNetwork,
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
				name: 'nodeCount',
				label: 'Nodes',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
		{
				name: 'channelCount',
				label: 'Channels',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
		{
				name: 'totalCapacitySats',
				label: 'Total capacity sats',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
		{
				name: 'torNodeCount',
				label: 'Tor nodes',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
		{
				name: 'clearnetNodeCount',
				label: 'Clearnet nodes',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
		{
				name: 'unannouncedNodeCount',
				label: 'Unannounced nodes',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
		{
				name: 'averageCapacitySats',
				label: 'Average capacity sats',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
		{
				name: 'medianCapacitySats',
				label: 'Median capacity sats',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
		{
				name: 'averageFeeRatePpm',
				label: 'Average fee rate ppm',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
		{
				name: 'medianFeeRatePpm',
				label: 'Median fee rate ppm',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
