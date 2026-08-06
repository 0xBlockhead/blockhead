// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidBorrowLendPosition,
	labels: {
		singular: 'hyperliquid borrow lend position',
		plural: 'hyperliquid borrow lend positions',
	},
	description: 'An account borrow/lend balance against one Hyperliquid spot token index from borrowLendUserState.tokenToState.',
})({
	$account: {
		entityType: EntityType.HyperliquidAccount,
		cardinality: EntityFieldCardinality.One,
	},
	tokenIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$reserve: {
		entityType: EntityType.HyperliquidBorrowLendReserve,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	$asset: {
		entityType: EntityType.HyperliquidSpotAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	borrowBasis: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	borrowValue: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	supplyBasis: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	supplyValue: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
})({
	selectors: {
		AccountTokenIndex: [
			'$account',
			'tokenIndex',
		],
	},
})
