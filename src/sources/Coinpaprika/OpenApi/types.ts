import type { components } from '$/sources/Coinpaprika/OpenApi/openapi.d.ts'

export type CoinpaprikaCoin = components['schemas']['coin_extended']

export type CoinpaprikaTicker = components['schemas']['tick']

/** `components.schemas.coins_ohlcv` — today, latest, and historical OHLCV. */
export type CoinpaprikaOhlcvRow = components['schemas']['coins_ohlcv']
