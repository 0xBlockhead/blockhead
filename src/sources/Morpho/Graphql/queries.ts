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
import {
	morphoGraphqlAccountPositionsDataWire,
	morphoGraphqlMarketDataWire,
	morphoGraphqlMarketsDataWire,
	morphoGraphqlVaultDataWire,
	morphoGraphqlVaultsDataWire,
	type MorphoGraphqlAccountMarketPosition,
	type MorphoGraphqlAccountMarketPositionWire,
	type MorphoGraphqlAccountPosition,
	type MorphoGraphqlAccountVaultPosition,
	type MorphoGraphqlAccountVaultPositionWire,
	type MorphoGraphqlMarket,
	type MorphoGraphqlMarketStateWire,
	type MorphoGraphqlMarketWire,
	type MorphoGraphqlVault,
	type MorphoGraphqlVaultStateWire,
	type MorphoGraphqlVaultWire,
} from './types.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'

const marketFields = `
	marketId
	creationBlockNumber
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
	}
	state {
		supplyAssets
		supplyShares
		borrowAssets
		borrowShares
		timestamp
		blockNumber
	}`

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`${Source.Morpho_Graphql}: invalid ${label} response envelope`)
	}
}

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

const assertGraphqlAmount = (
	value: string | number,
	label: string
) => {
	if (typeof value === 'number') {
		if (!Number.isSafeInteger(value) || value < 0)
			throw new Error(`${Source.Morpho_Graphql}: invalid ${label} ${String(value)}`)
		return String(value)
	}
	if (value.length < 1 || !/^(?:0|[1-9]\d*)$/.test(value))
		throw new Error(`${Source.Morpho_Graphql}: invalid ${label} ${value}`)
	return value
}

const normalizeMarketState = (
	wire: MorphoGraphqlMarketStateWire
) => ({
	totalSupplyAssets: assertGraphqlAmount(wire.supplyAssets, 'supplyAssets'),
	totalSupplyShares: assertGraphqlAmount(wire.supplyShares, 'supplyShares'),
	totalBorrowAssets: assertGraphqlAmount(wire.borrowAssets, 'borrowAssets'),
	totalBorrowShares: assertGraphqlAmount(wire.borrowShares, 'borrowShares'),
	lastAccrualTimestamp: wire.timestamp,
	lastIndexedBlock: assertGraphqlAmount(wire.blockNumber, 'blockNumber'),
})

const normalizeMarket = (
	wire: MorphoGraphqlMarketWire,
	chainIds: readonly number[]
): MorphoGraphqlMarket => {
	assertChainId(wire.chain.id)
	if (!chainIds.includes(wire.chain.id))
		throw new Error(`${Source.Morpho_Graphql}: market chain filter violated`)

	return {
		marketId: assertMarketId(wire.marketId),
		chainId: wire.chain.id,
		loanAssetAddress: assertAddress(wire.loanAsset.address, 'loan asset address'),
		collateralAssetAddress: assertAddress(wire.collateralAsset.address, 'collateral asset address'),
		lltvWad: assertNonEmpty(wire.lltv, 'lltv'),
		irmAddress: assertAddress(wire.irmAddress, 'irm address'),
		oracleAddress: assertAddress(wire.oracle.address, 'oracle address'),
		...(wire.creationBlockNumber != null && {
			creationBlockNumber: assertGraphqlAmount(wire.creationBlockNumber, 'creationBlockNumber'),
		}),
		...(wire.state != null && {
			state: normalizeMarketState(wire.state),
		}),
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
	}
	state {
		totalAssets
		totalSupply
		timestamp
		blockNumber
	}`

const normalizeVaultState = (
	wire: MorphoGraphqlVaultStateWire
) => ({
	totalAssets: assertGraphqlAmount(wire.totalAssets, 'totalAssets'),
	totalSupply: assertGraphqlAmount(wire.totalSupply, 'totalSupply'),
	lastAccrualTimestamp: wire.timestamp,
	lastIndexedBlock: assertGraphqlAmount(wire.blockNumber, 'blockNumber'),
})

const normalizeVault = (
	wire: MorphoGraphqlVaultWire,
	chainIds: readonly number[]
): MorphoGraphqlVault => {
	assertChainId(wire.chain.id)
	if (!chainIds.includes(wire.chain.id))
		throw new Error(`${Source.Morpho_Graphql}: vault chain filter violated`)

	return {
		address: assertAddress(wire.address, 'vault address'),
		chainId: wire.chain.id,
		symbol: assertNonEmpty(wire.symbol, 'vault symbol'),
		name: assertNonEmpty(wire.name, 'vault name'),
		listed: assertListed(wire.listed),
		assetAddress: assertAddress(wire.asset.address, 'vault asset address'),
		assetDecimals: assertDecimals(wire.asset.decimals, 'vault asset decimals'),
		...(wire.state != null && {
			state: normalizeVaultState(wire.state),
		}),
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

	const data = assertEnvelope(
		'markets',
		morphoGraphqlMarketsDataWire,
		await queryMorpho(`
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
	)
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
	const data = assertEnvelope(
		'market',
		morphoGraphqlMarketDataWire,
		await queryMorpho(`
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
	)
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

	const data = assertEnvelope(
		'vaults',
		morphoGraphqlVaultsDataWire,
		await queryMorpho(`
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
	)
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
	const data = assertEnvelope(
		'vault',
		morphoGraphqlVaultDataWire,
		await queryMorpho(`
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
	)
	if (data.vaultByAddress == null)
		throw new Error(`${Source.Morpho_Graphql}: vault response missing vaultByAddress`)

	const vault = normalizeVault(data.vaultByAddress, [
		chainId,
	])
	if (vault.address !== normalizedAddress)
		throw new Error(`${Source.Morpho_Graphql}: vault address mismatch`)

	return vault
}

const assertOptionalFiniteNumber = (
	value: number | undefined,
	label: string
) => {
	if (value == null)
		return undefined
	if (!Number.isFinite(value))
		throw new Error(`${Source.Morpho_Graphql}: invalid ${label} ${String(value)}`)
	return value
}

const normalizeMarketPosition = (
	wire: MorphoGraphqlAccountMarketPositionWire,
	expected: {
		chainId: number
		account: `0x${string}`
	}
): MorphoGraphqlAccountMarketPosition | null => {
	const supplyAssets = assertGraphqlAmount(wire.state.supplyAssets, 'supplyAssets')
	const supplyShares = assertGraphqlAmount(wire.state.supplyShares, 'supplyShares')
	const borrowAssets = assertGraphqlAmount(wire.state.borrowAssets, 'borrowAssets')
	const borrowShares = assertGraphqlAmount(wire.state.borrowShares, 'borrowShares')
	const collateral = assertGraphqlAmount(wire.state.collateral, 'collateral')
	if (
		supplyAssets === '0'
		&& supplyShares === '0'
		&& borrowAssets === '0'
		&& borrowShares === '0'
		&& collateral === '0'
	)
		return null

	const supplyAssetsUsd = assertOptionalFiniteNumber(wire.state.supplyAssetsUsd, 'supplyAssetsUsd')
	const borrowAssetsUsd = assertOptionalFiniteNumber(wire.state.borrowAssetsUsd, 'borrowAssetsUsd')
	const collateralUsd = assertOptionalFiniteNumber(wire.state.collateralUsd, 'collateralUsd')

	return {
		protocol: 'Morpho Blue',
		kind: 'market',
		chainId: expected.chainId,
		account: expected.account,
		marketId: assertMarketId(wire.market.marketId),
		supplyAssets,
		supplyShares,
		borrowAssets,
		borrowShares,
		collateral,
		...(supplyAssetsUsd != null && { supplyAssetsUsd }),
		...(borrowAssetsUsd != null && { borrowAssetsUsd }),
		...(collateralUsd != null && { collateralUsd }),
	}
}

const normalizeVaultPosition = (
	wire: MorphoGraphqlAccountVaultPositionWire,
	expected: {
		chainId: number
		account: `0x${string}`
	}
): MorphoGraphqlAccountVaultPosition | null => {
	const assets = assertGraphqlAmount(wire.state.assets, 'assets')
	const shares = assertGraphqlAmount(wire.state.shares, 'shares')
	if (assets === '0' && shares === '0')
		return null

	const assetsUsd = assertOptionalFiniteNumber(wire.state.assetsUsd, 'assetsUsd')

	return {
		protocol: 'Morpho Vault',
		kind: 'vault',
		chainId: expected.chainId,
		account: expected.account,
		vaultAddress: assertAddress(wire.vault.address, 'vault address'),
		vaultName: assertNonEmpty(wire.vault.name, 'vault name'),
		vaultSymbol: assertNonEmpty(wire.vault.symbol, 'vault symbol'),
		assets,
		shares,
		...(assetsUsd != null && { assetsUsd }),
	}
}

/**
 * Account Morpho Blue market + MetaMorpho vault positions via documented `userByAddress`.
 * @see https://docs.morpho.org/tools/offchain/api/morpho/
 * @see https://docs.morpho.org/tools/offchain/api/morpho-vaults/
 */
export const getAccountPositions = async ({
	chainId,
	account,
}: {
	chainId: number
	account: string
}): Promise<MorphoGraphqlAccountPosition[]> => {
	assertChainId(chainId)
	const normalizedAccount = assertAddress(account, 'account')
	const data = assertEnvelope(
		'account positions',
		morphoGraphqlAccountPositionsDataWire,
		await queryMorpho(`
		query MorphoAccountPositions(
			$chainId: Int!,
			$address: String!
		) {
			userByAddress(
				chainId: $chainId,
				address: $address
			) {
				address
				marketPositions {
					market {
						marketId
					}
					state {
						supplyAssets
						supplyShares
						borrowAssets
						borrowShares
						collateral
						supplyAssetsUsd
						borrowAssetsUsd
						collateralUsd
					}
				}
				vaultPositions {
					vault {
						address
						name
						symbol
					}
					state {
						assets
						shares
						assetsUsd
					}
				}
			}
		}
	`, {
			chainId,
			address: normalizedAccount,
		})
	)

	// Absent user means no indexed positions for this account on this chain.
	if (data.userByAddress == null)
		return []

	const responseAddress = assertAddress(data.userByAddress.address, 'account')
	if (responseAddress !== normalizedAccount)
		throw new Error(`${Source.Morpho_Graphql}: account positions address mismatch`)

	return [
		...data.userByAddress.marketPositions.map((wire) => (
			normalizeMarketPosition(wire, {
				chainId,
				account: normalizedAccount,
			})
		)),
		...data.userByAddress.vaultPositions.map((wire) => (
			normalizeVaultPosition(wire, {
				chainId,
				account: normalizedAccount,
			})
		)),
	].filter((position) => position != null)
}
