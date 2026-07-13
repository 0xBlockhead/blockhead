// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidSpotAsset_TimestampSelector {
	SpotAssetTimestampMsSource = 'SpotAssetTimestampMsSource',
}
export const HyperliquidSpotAsset_Timestamp = entity({
	entityType: EntityType.HyperliquidSpotAsset_Timestamp,
	labels: {
		singular: 'hyperliquid spot asset timestamp',
		plural: 'hyperliquid spot asset observations',
	},
})({
	$spotAsset: {
		label: 'spot asset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HyperliquidSpotAsset,
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
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	szDecimals: {
		label: 'sz decimals',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	weiDecimals: {
		label: 'wei decimals',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenId: {
		label: 'Token ID',
		description: 'The token identifier within its collection or contract.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SpotAssetTimestampMsSource: [
			'$spotAsset',
			'timestampMs',
			'source',
		],
	},
})
