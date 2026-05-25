import type { components } from '$/sources/Coinpaprika/OpenApi/openapi.d.ts'

export type CoinpaprikaCoin = components['schemas']['coin_extended']

export type CoinpaprikaTicker = components['schemas']['tick']

/** `components.schemas.coins_ohlcv` — today, latest, and historical OHLCV. */
export type CoinpaprikaOhlcv = components['schemas']['coins_ohlcv']

/** `GET /coins/{coin_id}/markets` row. */
export type CoinpaprikaMarket = components['schemas']['market']
