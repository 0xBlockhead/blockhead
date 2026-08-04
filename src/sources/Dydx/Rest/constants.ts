/**
 * dYdX Indexer Comlink REST catalogs (path prefix, input bounds, identity patterns).
 * @see https://docs.dydx.exchange/api_integration-indexer/indexer_api
 * @see https://raw.githubusercontent.com/dydxprotocol/v4-chain/main/indexer/services/comlink/public/swagger.json
 */


// Constants

/** Comlink HTTP path prefix for indexer reads. */
export const dydxIndexerRestPathPrefix = '/v4'

/** Bech32 dYdX account address (prefix + 38 HRP chars). */
export const dydxAddressPattern = /^dydx1[023456789acdefghjklmnpqrstuvwxyz]{38}$/

/** Perpetual market ticker (e.g. `BTC-USD`). */
export const dydxMarketTickerPattern = /^[A-Z0-9][A-Z0-9._-]{1,63}$/

export const dydxPageLimitMin = 1

export const dydxPageLimitMax = 100

export const dydxSubaccountNumberMax = 128_000

/** Fail-closed ceiling for `/v4/perpetualMarkets` map size. */
export const dydxPerpetualMarketsResponseMax = 500
