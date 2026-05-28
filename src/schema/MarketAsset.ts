/**
 * Leg of a `Market` id: not an `EntityType`; a discriminated union of coin, instance, or currency.
 */
import { type } from 'arktype'
import { MarketAssetKind } from '$/constants/Market.ts'
import Coin from '$/schema/Coin.ts'
import CoinInstance from '$/schema/EvmCoinInstance.ts'
import Currency from '$/schema/Currency.ts'

const id = type.or(
	type({
		kind: type.unit(MarketAssetKind.Coin),
		$coin: Coin.id,
	}),
	type({
		kind: type.unit(MarketAssetKind.CoinInstance),
		$coinInstance: CoinInstance.id,
	}),
	type({
		kind: type.unit(MarketAssetKind.Currency),
		$currency: Currency.id,
	}),
)

export default {
	id,
}
