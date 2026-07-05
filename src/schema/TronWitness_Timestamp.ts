// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronWitness_TimestampSelector {
	WitnessTimestampMsSource = 'WitnessTimestampMsSource',
}
export default {
	entityType: EntityType.TronWitness_Timestamp,
	label: 'tron witness timestamp',
	labelPlural: 'tron witness observations',
	selectors: [
		{
			name: TronWitness_TimestampSelector.WitnessTimestampMsSource,
			fields: [
				'$witness',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$witness',
				label: 'Witness',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TronWitness,
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
				name: 'url',
				label: 'URL',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'voteCount',
				label: 'Votes',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'totalProduced',
				label: 'Total produced',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'totalMissed',
				label: 'Total missed',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'latestBlockHeight',
				label: 'Latest block height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'latestSlotNumber',
				label: 'Latest slot number',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'active',
				label: 'Active',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
