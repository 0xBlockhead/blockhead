// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum LightningNode_TimestampSelector {
	NodeTimestampMsSource = 'NodeTimestampMsSource',
}
export default {
	entityType: EntityType.LightningNode_Timestamp,
	label: 'Lightning node timestamp',
	labelPlural: 'Lightning node observations',
	selectors: [
		{
			name: LightningNode_TimestampSelector.NodeTimestampMsSource,
			fields: [
				'$node',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$node',
				label: 'Node',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LightningNode,
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
				name: 'alias',
				label: 'Alias',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
					Source.LightningLnd_Rest,
				],
		},
		{
				name: 'color',
				label: 'Color',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
		{
				name: 'capacitySats',
				label: 'Capacity sats',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
					Source.LightningLnd_Rest,
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
					Source.LightningLnd_Rest,
				],
		},
		{
				name: 'firstSeenMs',
				label: 'First seen',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
		{
				name: 'updatedAtMs',
				label: 'Updated',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
					Source.LightningLnd_Rest,
				],
		},
		{
				name: 'countryCode',
				label: 'Country',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
		{
				name: 'city',
				label: 'City',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
		{
				name: 'networkAddresses',
				label: 'Network addresses',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.LightningMempoolSpace_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
