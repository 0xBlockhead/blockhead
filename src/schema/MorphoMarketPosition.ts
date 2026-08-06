// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MorphoMarketPosition,
	labels: {
		singular: 'Morpho market position',
		plural: 'Morpho market positions',
	},
	description: 'An account supply/borrow/collateral position in a Morpho Blue market.',
})({
	$account: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$market: {
		entityType: EntityType.MorphoMarket,
		cardinality: EntityFieldCardinality.One,
	},
	supplyAssets: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Graphql,
		],
	},
	supplyShares: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Graphql,
		],
	},
	borrowAssets: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Graphql,
		],
	},
	borrowShares: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Graphql,
		],
	},
	collateral: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Graphql,
		],
	},
	supplyAssetsUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Graphql,
		],
	},
	borrowAssetsUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Graphql,
		],
	},
	collateralUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Graphql,
		],
	},
})({
	selectors: {
		AccountMarket: [
			'$account',
			'$market',
		],
	},
})
