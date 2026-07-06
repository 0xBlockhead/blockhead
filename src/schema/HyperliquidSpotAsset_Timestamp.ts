// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidSpotAsset_TimestampSelector {
	SpotAssetTimestampMsSource = 'SpotAssetTimestampMsSource',
}
export default {
	entityType: EntityType.HyperliquidSpotAsset_Timestamp,
	label: 'hyperliquid spot asset timestamp',
	labelPlural: 'hyperliquid spot asset observations',
	selectors: [
		{
			name: HyperliquidSpotAsset_TimestampSelector.SpotAssetTimestampMsSource,
			fields: [
				'$spotAsset',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$spotAsset',
			label: 'spot asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HyperliquidSpotAsset,
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
			name: 'szDecimals',
			label: 'sz decimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'weiDecimals',
			label: 'wei decimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokenId',
			label: 'Token ID',
			description: 'The token identifier within its collection or contract.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
