/**
 * Morpho GraphQL market enumeration.
 * @see https://docs.morpho.org/developers/api/morpho/
 */
import { Source } from '$/sources/Source.ts'

import {
	morphoGraphqlNetworkByChainId,
	morphoMarketPageLimit,
} from './constants.ts'
import { queryMorpho } from './client.ts'
import type { MorphoGraphqlMarketsData } from './types.ts'

const marketFields = `
	marketId
	chain {
		id
	}
	loanAsset {
		address
	}
	collateralAsset {
		address
	}
	lltv
	irmAddress
	oracle {
		address
	}`

const assertChainId = (chainId: number) => {
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Morpho_Graphql}: invalid chain id ${String(chainId)}`)
	if (morphoGraphqlNetworkByChainId[chainId] == null)
		throw new Error(`${Source.Morpho_Graphql}: unsupported chain id ${String(chainId)}`)
}

/** List the first 100 Morpho Blue markets filtered to supported EIP-155 chains. */
export const listMarkets = async ({
	chainIds,
}: {
	chainIds: readonly number[]
}) => {
	if (chainIds.length < 1)
		throw new Error(`${Source.Morpho_Graphql}: chainIds required`)
	for (const chainId of chainIds)
		assertChainId(chainId)

	const data = await queryMorpho<MorphoGraphqlMarketsData>(`
		query MorphoMarkets(
			$chainIds: [Int!]
		) {
			markets(
				first: ${String(morphoMarketPageLimit)}
				orderBy: SupplyAssetsUsd
				orderDirection: Desc
				where: {
					chainId_in: $chainIds
				}
			) {
				items {
					${marketFields}
				}
			}
		}
	`, {
		chainIds: [
			...chainIds,
		],
	})
	if (data.markets == null)
		throw new Error(`${Source.Morpho_Graphql}: markets response missing markets`)
	if (data.markets.items == null)
		throw new Error(`${Source.Morpho_Graphql}: markets response missing items`)
	if (data.markets.items.length > morphoMarketPageLimit)
		throw new Error(`${Source.Morpho_Graphql}: markets response exceeds page limit`)
	for (const market of data.markets.items)
		if (!chainIds.includes(market.chain.id))
			throw new Error(`${Source.Morpho_Graphql}: market chain filter violated`)

	return data.markets.items
}
