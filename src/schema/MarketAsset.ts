// Generated from APP.ts.

import { MarketAssetKind } from '$/constants/Market.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const constantsInternalSources = [
	Source.Constants_Internal,
] as const

export default entity({
	entityType: EntityType.MarketAsset,
	labels: {
		singular: 'Market asset',
		plural: 'market assets',
	},
})({
	kind: {
		primitiveType: type.enumerated(...Object.values(MarketAssetKind)),
		cardinality: EntityFieldCardinality.One,
	},
	assetKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		KindAssetKey: [
			'kind',
			'assetKey',
		],
	},

	facets: {
		Coin: facet({
			path: [
				'kind',
			],
			is: 'Coin',
		})({
			$coin: {
				entityType: EntityType.Coin,
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
		}),
		CoinInstance: facet({
			path: [
				'kind',
			],
			is: 'CoinInstance',
		})({
			$coinInstance: {
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.One,
			},
		}),
		Currency: facet({
			path: [
				'kind',
			],
			is: 'Currency',
		})({
			$currency: {
				entityType: EntityType.Currency,
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
		}),
	},
})
