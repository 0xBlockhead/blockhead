import { stringify } from 'devalue'

import {
	coingeckoOhlcDayWindowLengths,
	MarketTimeIntervalUnit,
	type MarketTimeInterval,
} from '$/constants/Market.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import type { Entity } from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'


export type OhlcCandle = readonly [
	timestampMs: number,
	open: number,
	high: number,
	low: number,
	close: number,
	quoteVolume?: number,
]


export const marketTimeIntervalKey = (timeInterval: MarketTimeInterval) => (
	`${timeInterval.unit}:${String(timeInterval.value)}`
)


export const assertCoingeckoDayOhlcTimeInterval = (
	timeInterval: MarketTimeInterval,
	sourceLabel: string,
) => {
	if (timeInterval.unit !== MarketTimeIntervalUnit.Day) {
		throw new Error(`${sourceLabel}: OHLC timeInterval must be day-based`)
	}
	if (!(coingeckoOhlcDayWindowLengths as readonly number[]).includes(timeInterval.value)) {
		throw new Error(`${sourceLabel}: OHLC day window not supported`)
	}
}


export const marketTimeIntervalsEqual = (
	left: MarketTimeInterval,
	right: MarketTimeInterval,
) => (
	left.unit === right.unit
	&& left.value === right.value
)


export const candleFromOhlc = (
	$market: EntitySelector<typeof schema, EntityType.Market>,
	timeInterval: MarketTimeInterval,
	feedKey: string,
	[timestampMs, open, high, low, close, quoteVolume]: OhlcCandle,
) => {
	const id = (
		{
			$market,
			timeInterval,
			timestampMs: Math.floor(timestampMs),
			feedKey,
		}
	) satisfies EntitySelector<typeof schema, EntityType.Market_TimeInterval_Timestamp>

	return (
		{
			[EntityMetaKey.Selector]: id,
			open: BigInt(Math.round(open * 1e8)),
			high: BigInt(Math.round(high * 1e8)),
			low: BigInt(Math.round(low * 1e8)),
			close: BigInt(Math.round(close * 1e8)),
			...(quoteVolume != null && {
				quoteVolume: BigInt(Math.round(quoteVolume * 1e8)),
			}),
		}
	)
}


export const candlesFromOhlc = (
	$market: EntitySelector<typeof schema, EntityType.Market>,
	timeInterval: MarketTimeInterval,
	feedKey: string,
	rows: OhlcCandle[],
) => (
	rows.map((row) => (
		candleFromOhlc(
			$market,
			timeInterval,
			feedKey,
			row,
		)
	))
)


export const dedupeCandleEntitiesById = (
	rows: readonly (
		Entity<typeof schema, EntityType.Market_TimeInterval_Timestamp>
		& { [EntityMetaKey.SelectorKey]?: string }
	)[],
) => {
	const seenSelectorKeys = new Set<string>()

	return (
		rows.filter((row) => {
			const idKey = (
				row[EntityMetaKey.SelectorKey]
				?? stringify(row[EntityMetaKey.Selector])
			)

			if (seenSelectorKeys.has(idKey))
				return false

			seenSelectorKeys.add(idKey)
			return true
		})
	)
}
