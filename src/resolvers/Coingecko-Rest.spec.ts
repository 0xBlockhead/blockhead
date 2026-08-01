import {
	describe,
	expect,
	it,
} from 'vitest'

import coingecko from '$/resolvers/Coingecko-Rest.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

describe('CoinGecko resolver collapse', () => {
	it('retains each unique REST and derivative projection under one source', () => {
		expect(coingecko.source).toBe(Source.Coingecko_Rest)
		expect([
		[EntityType.Coin, '$$timestamps'],
		[EntityType.Coin, '$$marketsWithCoinAsBase'],
		[EntityType.Market, '$$derivativeTimestamps'],
		[EntityType.Market, '$$marketTimeIntervalTimestamps'],
		[EntityType.Market_Derivative_Timestamp, 'fundingRate'],
		[EntityType.Market_Timestamp, 'price'],
		[EntityType.Market_TimeInterval_Timestamp, 'open'],
	].map(([entityType, field]) => (
		coingecko.resolvers.filter((resolver) => (
			resolver.entityType === entityType
			&& field in resolver.projections
		)).length
	))).toEqual([
		1,
		1,
		1,
		1,
		1,
		1,
		1,
	])
	})
})
