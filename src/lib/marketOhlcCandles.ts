import { stringify } from 'devalue'

import {
	coingeckoOhlcDayWindowLengths,
	MarketTimeIntervalUnit,
	type MarketTimeInterval,
} from '$/constants/Market.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { Entity } from '$/schema/$schema.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'


export type OhlcCandle = readonly number[]


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
	$market: EntityId<typeof schema, EntityType.Market>,
	timeInterval: MarketTimeInterval,
	[timestampMs, open, high, low, close]: OhlcCandle,
) => {
	if (
		timestampMs == null
		|| open == null
		|| high == null
		|| low == null
		|| close == null
	) {
		throw new Error('OHLC row must contain timestamp, open, high, low, and close')
	}
	const id = (
		{
			$market,
			timeInterval,
			timestampMs: Math.floor(timestampMs),
		}
	) satisfies EntityId<typeof schema, EntityType.Market_TimeInterval_Timestamp>

	return (
		{
			[EntityMetaKey.Id]: id,
			open: BigInt(Math.round(open * 1e8)),
			high: BigInt(Math.round(high * 1e8)),
			low: BigInt(Math.round(low * 1e8)),
			close: BigInt(Math.round(close * 1e8)),
		}
	)
}


export const candlesFromOhlc = (
	$market: EntityId<typeof schema, EntityType.Market>,
	timeInterval: MarketTimeInterval,
	rows: OhlcCandle[],
) => (
	rows.map((row) => (
		candleFromOhlc(
			$market,
			timeInterval,
			row,
		)
	))
)


export const dedupeCandleEntitiesById = (
	rows: (
		Entity<typeof schema, EntityType.Market_TimeInterval_Timestamp>
		& { [EntityMetaKey.IdKey]?: string }
	)[],
) => {
	const seenIdKeys = new Set<string>()

	return (
		rows.filter((row) => {
			const idKey = (
				row[EntityMetaKey.IdKey]
				?? stringify(row[EntityMetaKey.Id])
			)

			if (seenIdKeys.has(idKey))
				return false

			seenIdKeys.add(idKey)
			return true
		})
	)
}
