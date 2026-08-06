/**
 * Morpho GraphQL market and MetaMorpho vault enumeration.
 * @see https://docs.morpho.org/developers/api/morpho/
 * @see https://docs.morpho.org/developers/api/morpho-vaults/
 */
import { Source } from '$/sources/Source.ts'

import {
	morphoGraphqlNetworkByChainId,
	morphoMarketIdPattern,
	morphoMarketPageLimit,
	morphoVaultPageLimit,
} from './constants.ts'
import { queryMorpho } from './client.ts'
import type {
	MorphoGraphqlMarket,
	MorphoGraphqlMarketData,
	MorphoGraphqlMarketsData,
	MorphoGraphqlMarketWire,
	MorphoGraphqlVault,
	MorphoGraphqlVaultData,
	MorphoGraphqlVaultsData,
	MorphoGraphqlVaultWire,
} from './types.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'

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

const assertMarketId = (marketId: string | undefined) => {
	if (marketId == null || !morphoMarketIdPattern.test(marketId))
		throw new Error(`${Source.Morpho_Graphql}: invalid market id ${String(marketId)}`)
	const normalized = hexLowerOfByteSize(marketId, 32)
	if (normalized == null)
		throw new Error(`${Source.Morpho_Graphql}: invalid market id ${marketId}`)
	return normalized
}

const assertAddress = (
	address: string | undefined,
	label: string
) => {
	if (address == null)
		throw new Error(`${Source.Morpho_Graphql}: missing ${label}`)
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error(`${Source.Morpho_Graphql}: invalid ${label} ${address}`)
	return normalized
}

const assertNonEmpty = (
	value: string | undefined,
	label: string
) => {
	if (value == null || value.length < 1)
		throw new Error(`${Source.Morpho_Graphql}: missing ${label}`)
	return value
}

const assertDecimals = (
	decimals: number | undefined,
	label: string
) => {
	if (decimals == null || !Number.isSafeInteger(decimals) || decimals < 0)
		throw new Error(`${Source.Morpho_Graphql}: invalid ${label} ${String(decimals)}`)
	return decimals
}

const assertListed = (
	listed: boolean | undefined
) => {
	if (listed == null)
		throw new Error(`${Source.Morpho_Graphql}: vault missing listed`)
	return listed
}

const normalizeMarket = (
	wire: MorphoGraphqlMarketWire,
	chainIds: readonly number[]
): MorphoGraphqlMarket => {
	if (wire.chain == null || wire.chain.id == null)
		throw new Error(`${Source.Morpho_Graphql}: market missing chain id`)
	assertChainId(wire.chain.id)
	if (!chainIds.includes(wire.chain.id))
		throw new Error(`${Source.Morpho_Graphql}: market chain filter violated`)
	if (wire.loanAsset == null)
		throw new Error(`${Source.Morpho_Graphql}: market missing loan asset`)
	if (wire.collateralAsset == null)
		throw new Error(`${Source.Morpho_Graphql}: market missing collateral asset`)
	if (wire.oracle == null)
		throw new Error(`${Source.Morpho_Graphql}: market missing oracle`)

	return {
		marketId: assertMarketId(wire.marketId),
		chainId: wire.chain.id,
		loanAssetAddress: assertAddress(wire.loanAsset.address, 'loan asset address'),
		collateralAssetAddress: assertAddress(wire.collateralAsset.address, 'collateral asset address'),
		lltvWad: assertNonEmpty(wire.lltv, 'lltv'),
		irmAddress: assertAddress(wire.irmAddress, 'irm address'),
		oracleAddress: assertAddress(wire.oracle.address, 'oracle address'),
	}
}

const vaultFields = `
	address
	symbol
	name
	listed
	asset {
		address
		decimals
	}
	chain {
		id
	}`

const normalizeVault = (
	wire: MorphoGraphqlVaultWire,
	chainIds: readonly number[]
): MorphoGraphqlVault => {
	if (wire.chain == null || wire.chain.id == null)
		throw new Error(`${Source.Morpho_Graphql}: vault missing chain id`)
	assertChainId(wire.chain.id)
	if (!chainIds.includes(wire.chain.id))
		throw new Error(`${Source.Morpho_Graphql}: vault chain filter violated`)
	if (wire.asset == null)
		throw new Error(`${Source.Morpho_Graphql}: vault missing asset`)

	return {
		address: assertAddress(wire.address, 'vault address'),
		chainId: wire.chain.id,
		symbol: assertNonEmpty(wire.symbol, 'vault symbol'),
		name: assertNonEmpty(wire.name, 'vault name'),
		listed: assertListed(wire.listed),
		assetAddress: assertAddress(wire.asset.address, 'vault asset address'),
		assetDecimals: assertDecimals(wire.asset.decimals, 'vault asset decimals'),
	}
}

/** List the first 100 Morpho Blue markets filtered to supported EIP-155 chains. */
export const listMarkets = async ({
	chainIds,
	limit = morphoMarketPageLimit,
}: {
	chainIds: readonly number[]
	limit?: number
}) => {
	if (chainIds.length < 1)
		throw new Error(`${Source.Morpho_Graphql}: chainIds required`)
	for (const chainId of chainIds)
		assertChainId(chainId)
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > morphoMarketPageLimit)
		throw new Error(`${Source.Morpho_Graphql}: limit must be between 1 and ${String(morphoMarketPageLimit)}`)

	const data = await queryMorpho<MorphoGraphqlMarketsData>(`
		query MorphoMarkets(
			$chainIds: [Int!],
			$limit: Int!
		) {
			markets(
				first: $limit
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
		limit,
	})
	if (data.markets == null)
		throw new Error(`${Source.Morpho_Graphql}: markets response missing markets`)
	if (data.markets.items == null)
		throw new Error(`${Source.Morpho_Graphql}: markets response missing items`)
	if (data.markets.items.length > limit)
		throw new Error(`${Source.Morpho_Graphql}: markets response exceeds page limit`)

	return data.markets.items.map((market) => (
		normalizeMarket(market, chainIds)
	))
}

/** Read one Morpho Blue market by its EIP-155 chain and bytes32 market id. */
export const getMarket = async ({
	chainId,
	marketId,
}: {
	chainId: number
	marketId: string
}) => {
	assertChainId(chainId)
	const normalizedMarketId = assertMarketId(marketId)
	const data = await queryMorpho<MorphoGraphqlMarketData>(`
		query MorphoMarket(
			$chainId: Int!,
			$marketId: String!
		) {
			marketById(
				chainId: $chainId,
				marketId: $marketId
			) {
				${marketFields}
			}
		}
	`, {
		chainId,
		marketId: normalizedMarketId,
	})
	if (data.marketById == null)
		throw new Error(`${Source.Morpho_Graphql}: market response missing marketById`)

	const market = normalizeMarket(data.marketById, [
		chainId,
	])
	if (market.marketId !== normalizedMarketId)
		throw new Error(`${Source.Morpho_Graphql}: market id mismatch`)

	return market
}

/** List the first 100 MetaMorpho vaults filtered to supported EIP-155 chains. */
export const listVaults = async ({
	chainIds,
	limit = morphoVaultPageLimit,
}: {
	chainIds: readonly number[]
	limit?: number
}) => {
	if (chainIds.length < 1)
		throw new Error(`${Source.Morpho_Graphql}: chainIds required`)
	for (const chainId of chainIds)
		assertChainId(chainId)
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > morphoVaultPageLimit)
		throw new Error(`${Source.Morpho_Graphql}: limit must be between 1 and ${String(morphoVaultPageLimit)}`)

	const data = await queryMorpho<MorphoGraphqlVaultsData>(`
		query MorphoVaults(
			$chainIds: [Int!],
			$limit: Int!
		) {
			vaults(
				first: $limit
				orderBy: TotalAssetsUsd
				orderDirection: Desc
				where: {
					chainId_in: $chainIds
				}
			) {
				items {
					${vaultFields}
				}
			}
		}
	`, {
		chainIds: [
			...chainIds,
		],
		limit,
	})
	if (data.vaults == null)
		throw new Error(`${Source.Morpho_Graphql}: vaults response missing vaults`)
	if (data.vaults.items == null)
		throw new Error(`${Source.Morpho_Graphql}: vaults response missing items`)
	if (data.vaults.items.length > limit)
		throw new Error(`${Source.Morpho_Graphql}: vaults response exceeds page limit`)

	return data.vaults.items.map((vault) => (
		normalizeVault(vault, chainIds)
	))
}

/** Read one MetaMorpho vault by its EIP-155 chain and vault contract address. */
export const getVault = async ({
	chainId,
	address,
}: {
	chainId: number
	address: string
}) => {
	assertChainId(chainId)
	const normalizedAddress = assertAddress(address, 'vault address')
	const data = await queryMorpho<MorphoGraphqlVaultData>(`
		query MorphoVault(
			$chainId: Int!,
			$address: String!
		) {
			vaultByAddress(
				chainId: $chainId,
				address: $address
			) {
				${vaultFields}
			}
		}
	`, {
		chainId,
		address: normalizedAddress,
	})
	if (data.vaultByAddress == null)
		throw new Error(`${Source.Morpho_Graphql}: vault response missing vaultByAddress`)

	const vault = normalizeVault(data.vaultByAddress, [
		chainId,
	])
	if (vault.address !== normalizedAddress)
		throw new Error(`${Source.Morpho_Graphql}: vault address mismatch`)

	return vault
}
