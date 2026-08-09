// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidSpotAsset,
	labels: {
		singular: 'hyperliquid spot asset',
		plural: 'hyperliquid spot assets',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	assetId: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	szDecimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	weiDecimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	tokenId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	$$basePairs: {
		entityType: EntityType.HyperliquidSpotPair,
		cardinality: EntityFieldCardinality.Many,
	},
	$$quotePairs: {
		entityType: EntityType.HyperliquidSpotPair,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAssetId: [
			'$network',
			'assetId',
		],
	},
})
