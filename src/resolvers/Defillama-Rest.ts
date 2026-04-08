import { CoinId } from '$/constants/Coin.ts'
import { defineEntityResolver } from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { getCurrentPrices } from '$/sources/Defillama/Rest/queries.ts'
import { Source } from '$/sources/$Sources.ts'

const coinIdToCoingeckoRef: Partial<Record<CoinId, string>> = {
	[CoinId.AAVE]: 'coingecko:aave',
	[CoinId.ADA]: 'coingecko:cardano',
	[CoinId.APT]: 'coingecko:aptos',
	[CoinId.ARB]: 'coingecko:arbitrum',
	[CoinId.AVAX]: 'coingecko:avalanche-2',
	[CoinId.BNB]: 'coingecko:binancecoin',
	[CoinId.BTC]: 'coingecko:bitcoin',
	[CoinId.CELO]: 'coingecko:celo',
	[CoinId.EDU]: 'coingecko:open-campus',
	[CoinId.ETH]: 'coingecko:ethereum',
	[CoinId.FIL]: 'coingecko:filecoin',
	[CoinId.LINK]: 'coingecko:chainlink',
	[CoinId.MATIC]: 'coingecko:matic-network',
	[CoinId.OP]: 'coingecko:optimism',
	[CoinId.POL]: 'coingecko:polygon-ecosystem-token',
	[CoinId.SEI]: 'coingecko:sei-network',
	[CoinId.SOL]: 'coingecko:solana',
	[CoinId.STETH]: 'coingecko:staked-ether',
	[CoinId.UNI]: 'coingecko:uniswap',
	[CoinId.USDC]: 'coingecko:usd-coin',
	[CoinId.USDT]: 'coingecko:tether',
	[CoinId.WBTC]: 'coingecko:wrapped-bitcoin',
	[CoinId.XDC]: 'coingecko:xdce',
}

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.CoinPrice,
			source: Source.Defillama,
			resolve: async (entityId) => {
				const llamaId = (
					typeof entityId.feedKey === 'string' && entityId.feedKey.trim() !== '' ?
						entityId.feedKey.trim()
					: entityId.$network != null ?
						(
							entityId.$coin.coinId === CoinId.ETH && entityId.$network.chainId === 1 ?
								'coingecko:ethereum'
							:
								undefined
						)
					:
						coinIdToCoingeckoRef[entityId.$coin.coinId]
				)
				if (llamaId == null) return {}
				const data = await getCurrentPrices([llamaId])
				const row = data.coins[llamaId]
				if (row == null) return {}
				const tsSec = row.timestamp
				return {
					[EntityMetaKey.Id]: entityId,
					price: BigInt(Math.round(row.price * 1e8)),
					timestampNs: BigInt(tsSec) * 1_000_000_000n,
					updatedAt: tsSec * 1000,
					transport: 'defillama-usd-1e8',
					encodedAssetId: llamaId,
				}
			},
		}),
	],
	entityFieldResolvers: [],
}
