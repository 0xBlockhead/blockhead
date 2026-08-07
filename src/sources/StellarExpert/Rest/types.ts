import {
	type as arktype,
	type Type,
} from 'arktype'


export const stellarExpertNetworkWire = arktype("'public' | 'testnet'")

export type StellarExpertNetwork = typeof stellarExpertNetworkWire.infer

export const stellarExpertLedgerTimestampSequenceWire = arktype({
	sequence: 'number.integer >= 0',
	timestamp: 'number.integer >= 0',
	date: 'string > 0',
})

export type StellarExpertLedgerTimestampSequence = typeof stellarExpertLedgerTimestampSequenceWire.infer

export const stellarExpertAssetRatingScoresWire = arktype({
	average: 'number',
	'age?': 'number',
	'trades?': 'number',
	'payments?': 'number',
	'trustlines?': 'number',
	'volume7d?': 'number',
	'interop?': 'number',
	'liquidity?': 'number',
}).and(arktype('Record<string, unknown>'))

export type StellarExpertAssetRatingScores = typeof stellarExpertAssetRatingScoresWire.infer

export const stellarExpertAssetRatingWire = arktype({
	asset: 'string > 0',
	rating: stellarExpertAssetRatingScoresWire,
})

export type StellarExpertAssetRating = typeof stellarExpertAssetRatingWire.infer

export const stellarExpertAssetInfoWire = arktype({
	asset: 'string > 0',
	'paging_token?': 'number.integer >= 0',
}).and(arktype('Record<string, unknown>'))

export type StellarExpertAssetInfo = typeof stellarExpertAssetInfoWire.infer

export const stellarExpertLinkWire = arktype({
	href: 'string',
})

export type StellarExpertLink = typeof stellarExpertLinkWire.infer

export const stellarExpertAssetPageWire = arktype({
	'_links?': {
		'self?': stellarExpertLinkWire,
		'prev?': stellarExpertLinkWire,
		'next?': stellarExpertLinkWire,
	},
	_embedded: {
		records: stellarExpertAssetInfoWire.array(),
	},
})

export type StellarExpertAssetPage = typeof stellarExpertAssetPageWire.infer

export const stellarExpertNetwork = stellarExpertNetworkWire satisfies Type<StellarExpertNetwork>
export const stellarExpertLedgerTimestampSequence = stellarExpertLedgerTimestampSequenceWire satisfies Type<StellarExpertLedgerTimestampSequence>
export const stellarExpertAssetRatingScores = stellarExpertAssetRatingScoresWire satisfies Type<StellarExpertAssetRatingScores>
export const stellarExpertAssetRating = stellarExpertAssetRatingWire satisfies Type<StellarExpertAssetRating>
export const stellarExpertAssetInfo = stellarExpertAssetInfoWire satisfies Type<StellarExpertAssetInfo>
export const stellarExpertLink = stellarExpertLinkWire satisfies Type<StellarExpertLink>
export const stellarExpertAssetPage = stellarExpertAssetPageWire satisfies Type<StellarExpertAssetPage>
