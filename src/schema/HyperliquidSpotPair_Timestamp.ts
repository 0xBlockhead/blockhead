// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidSpotPair_TimestampSelector {
	SpotPairTimestampMsSource = 'SpotPairTimestampMsSource',
}
export default {
	entityType: EntityType.HyperliquidSpotPair_Timestamp,
	label: 'hyperliquid spot pair timestamp',
	labelPlural: 'hyperliquid spot pair observations',
	selectors: [
		{
			name: HyperliquidSpotPair_TimestampSelector.SpotPairTimestampMsSource,
			fields: [
				'$spotPair',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$spotPair',
			label: 'spot pair',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HyperliquidSpotPair,
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
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'baseAssetId',
			label: 'base asset ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quoteAssetId',
			label: 'quote asset ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isCanonical',
			label: 'is canonical',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
