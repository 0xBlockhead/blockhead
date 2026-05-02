/**
 * Leg of a `Market` id: not an `EntityType`; a discriminated union of coin, instance, or ISO fiat.
 */
import { type } from 'arktype'
import { MarketAssetKind } from '$/constants/Market.ts'
import Coin from '$/schema/Coin.ts'
import CoinInstance from '$/schema/CoinInstance.ts'

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
		iso4217: 'string',
	}),
)

export default {
	id,
}
