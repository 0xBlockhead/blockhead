/**
 * Leg of a `Market` id: not an `EntityType`; a discriminated union of coin, instance, or currency.
 */
import { type } from 'arktype'
import { MarketAssetKind } from '$/constants/Market.ts'
import { CoinId } from '$/constants/Coin.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'

export const marketAsset = type.or(
	type({
		kind: type.unit(MarketAssetKind.Coin),
		$coin: type({
			coinId: type.valueOf(CoinId),
		}),
	}),
	type({
		kind: type.unit(MarketAssetKind.CoinInstance),
		$coinInstance: type.or(
			type({
				$network: type({
					caip2: type({
						namespace: 'string',
						reference: 'string',
					}),
				}),
				type: type.unit(CoinInstanceType.NativeCurrency),
			}),
			type({
				$network: type({
					caip2: type({
						namespace: 'string',
						reference: 'string',
					}),
				}),
				type: type.unit(CoinInstanceType.Erc20Token),
				$contract: type({
					$network: type({
						caip2: type({
							namespace: 'string',
							reference: 'string',
						}),
					}),
					address: EvmAddress,
				}),
			}),
		),
	}),
	type({
		kind: type.unit(MarketAssetKind.Currency),
		$currency: type({
			iso4217: type.valueOf(Iso4217),
		}),
	}),
)
