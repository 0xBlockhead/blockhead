// Generated from APP.ts.

import { MarketAssetKind } from '$/constants/Market.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MarketAsset,
	labels: {
		singular: 'Market asset',
		plural: 'market assets',
	},
})({
	kind: {
		label: 'Kind',
		primitiveType: type.enumerated(...Object.values(MarketAssetKind)),
		cardinality: EntityFieldCardinality.One,
	},
	assetKey: {
		label: 'Asset key',
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
				label: 'Coin',
				entityType: EntityType.Coin,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
		CoinInstance: facet({
			path: [
				'kind',
			],
			is: 'CoinInstance',
		})({
			$coinInstance: {
				label: 'Coin instance',
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
				label: 'Currency',
				entityType: EntityType.Currency,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
	},
})
