/**
 * Morpho GraphQL market and MetaMorpho vault enumeration.
 * @see https://docs.morpho.org/developers/api/morpho/
 * @see https://docs.morpho.org/developers/api/morpho-vaults/
 */
import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

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
	listed
	chain {
		id
	}
	loanAsset {
		address
		symbol
		decimals
	}
	collateralAsset {
		address
		symbol
		decimals
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
		fee
		utilization
		supplyApy
		borrowApy
		liquidityAssets
		collateralAssets
		supplyAssetsUsd
		borrowAssetsUsd
		collateralAssetsUsd
		liquidityAssetsUsd
		netSupplyApy
		netBorrowApy
		avgSupplyApy
		avgBorrowApy
		avgNetSupplyApy
		avgNetBorrowApy
		rewards {
			asset {
				address
				chain {
					id
				}
			}
			supplyApr
			borrowApr
		}
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


const normalizeReward = (
	wire: {
		asset: {
			address: string
			chain: {
				id: number
			}
		}
		supplyApr?: number
		borrowApr?: number
	}
) => {
	if (!Number.isSafeInteger(wire.asset.chain.id) || wire.asset.chain.id < 1)
		throw new Error(`${Source.Morpho_Graphql}: invalid reward asset chain id ${String(wire.asset.chain.id)}`)
	const supplyApr = assertOptionalFiniteNumber(wire.supplyApr, 'supplyApr')
	const borrowApr = assertOptionalFiniteNumber(wire.borrowApr, 'borrowApr')
	return {
		assetAddress: assertAddress(wire.asset.address, 'reward asset address'),
		assetChainId: wire.asset.chain.id,
		...(supplyApr != null && {
			supplyApr,
		}),
		...(borrowApr != null && {
			borrowApr,
		}),
	}
}

const normalizeMarketState = (
	wire: MorphoGraphqlMarketStateWire
) => {
	const supplyAssetsUsd = assertOptionalFiniteNumber(wire.supplyAssetsUsd, 'supplyAssetsUsd')
	const borrowAssetsUsd = assertOptionalFiniteNumber(wire.borrowAssetsUsd, 'borrowAssetsUsd')
	const collateralAssetsUsd = assertOptionalFiniteNumber(wire.collateralAssetsUsd, 'collateralAssetsUsd')
	const liquidityAssetsUsd = assertOptionalFiniteNumber(wire.liquidityAssetsUsd, 'liquidityAssetsUsd')
	const netSupplyApy = assertOptionalFiniteNumber(wire.netSupplyApy, 'netSupplyApy')
	const netBorrowApy = assertOptionalFiniteNumber(wire.netBorrowApy, 'netBorrowApy')
	const avgSupplyApy = assertOptionalFiniteNumber(wire.avgSupplyApy, 'avgSupplyApy')
	const avgBorrowApy = assertOptionalFiniteNumber(wire.avgBorrowApy, 'avgBorrowApy')
	const avgNetSupplyApy = assertOptionalFiniteNumber(wire.avgNetSupplyApy, 'avgNetSupplyApy')
	const avgNetBorrowApy = assertOptionalFiniteNumber(wire.avgNetBorrowApy, 'avgNetBorrowApy')
	const collateralAssets = (
		wire.collateralAssets == null ?
			undefined
		:
			assertGraphqlAmount(wire.collateralAssets, 'collateralAssets')
	)
	if (!Number.isFinite(wire.fee))
		throw new Error(`${Source.Morpho_Graphql}: invalid fee ${String(wire.fee)}`)
	if (!Number.isFinite(wire.utilization))
		throw new Error(`${Source.Morpho_Graphql}: invalid utilization ${String(wire.utilization)}`)
	if (!Number.isFinite(wire.supplyApy))
		throw new Error(`${Source.Morpho_Graphql}: invalid supplyApy ${String(wire.supplyApy)}`)
	if (!Number.isFinite(wire.borrowApy))
		throw new Error(`${Source.Morpho_Graphql}: invalid borrowApy ${String(wire.borrowApy)}`)

	const rewards = wire.rewards?.map(normalizeReward)

	return {
		totalSupplyAssets: assertGraphqlAmount(wire.supplyAssets, 'supplyAssets'),
		totalSupplyShares: assertGraphqlAmount(wire.supplyShares, 'supplyShares'),
		totalBorrowAssets: assertGraphqlAmount(wire.borrowAssets, 'borrowAssets'),
		totalBorrowShares: assertGraphqlAmount(wire.borrowShares, 'borrowShares'),
		lastAccrualTimestamp: wire.timestamp,
		lastIndexedBlock: assertGraphqlAmount(wire.blockNumber, 'blockNumber'),
		fee: wire.fee,
		utilization: wire.utilization,
		supplyApy: wire.supplyApy,
		borrowApy: wire.borrowApy,
		liquidityAssets: assertGraphqlAmount(wire.liquidityAssets, 'liquidityAssets'),
		...(collateralAssets != null && {
			collateralAssets,
		}),
		...(supplyAssetsUsd != null && {
			supplyAssetsUsd,
		}),
		...(borrowAssetsUsd != null && {
			borrowAssetsUsd,
		}),
		...(collateralAssetsUsd != null && {
			collateralAssetsUsd,
		}),
		...(liquidityAssetsUsd != null && {
			liquidityAssetsUsd,
		}),
		...(netSupplyApy != null && {
			netSupplyApy,
		}),
		...(netBorrowApy != null && {
			netBorrowApy,
		}),
		...(avgSupplyApy != null && {
			avgSupplyApy,
		}),
		...(avgBorrowApy != null && {
			avgBorrowApy,
		}),
		...(avgNetSupplyApy != null && {
			avgNetSupplyApy,
		}),
		...(avgNetBorrowApy != null && {
			avgNetBorrowApy,
		}),
		...(rewards != null && rewards.length > 0 && {
			rewards,
		}),
	}
}

const normalizeMarket = (
	wire: MorphoGraphqlMarketWire,
	chainIds: readonly number[]
): MorphoGraphqlMarket => {
	assertChainId(wire.chain.id)
	if (!chainIds.includes(wire.chain.id))
		throw new Error(`${Source.Morpho_Graphql}: market chain filter violated`)

	const loanAssetSymbol = (
		wire.loanAsset.symbol == null || wire.loanAsset.symbol.length < 1 ?
			undefined
		:
			wire.loanAsset.symbol
	)
	const collateralAssetSymbol = (
		wire.collateralAsset.symbol == null || wire.collateralAsset.symbol.length < 1 ?
			undefined
		:
			wire.collateralAsset.symbol
	)
	const loanAssetDecimals = (
		wire.loanAsset.decimals == null ?
			undefined
		:
			assertDecimals(wire.loanAsset.decimals, 'loan asset decimals')
	)
	const collateralAssetDecimals = (
		wire.collateralAsset.decimals == null ?
			undefined
		:
			assertDecimals(wire.collateralAsset.decimals, 'collateral asset decimals')
	)

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
		...(wire.listed != null && {
			listed: wire.listed,
		}),
		...(loanAssetSymbol != null && {
			loanAssetSymbol,
		}),
		...(loanAssetDecimals != null && {
			loanAssetDecimals,
		}),
		...(collateralAssetSymbol != null && {
			collateralAssetSymbol,
		}),
		...(collateralAssetDecimals != null && {
			collateralAssetDecimals,
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
		totalAssetsUsd
		apy
		netApy
		netApyExcludingRewards
		avgNetApy
		avgNetApyExcludingRewards
		fee
		sharePriceUsd
		sharePriceNumber
		allRewards {
			asset {
				address
				chain {
					id
				}
			}
			supplyApr
		}
	}`

const normalizeVaultState = (
	wire: MorphoGraphqlVaultStateWire
) => {
	const totalAssetsUsd = assertOptionalFiniteNumber(wire.totalAssetsUsd, 'totalAssetsUsd')
	const apy = assertOptionalFiniteNumber(wire.apy, 'apy')
	const netApy = assertOptionalFiniteNumber(wire.netApy, 'netApy')
	const netApyExcludingRewards = assertOptionalFiniteNumber(wire.netApyExcludingRewards, 'netApyExcludingRewards')
	const avgNetApy = assertOptionalFiniteNumber(wire.avgNetApy, 'avgNetApy')
	const avgNetApyExcludingRewards = assertOptionalFiniteNumber(wire.avgNetApyExcludingRewards, 'avgNetApyExcludingRewards')
	const fee = assertOptionalFiniteNumber(wire.fee, 'fee')
	const sharePriceUsd = assertOptionalFiniteNumber(wire.sharePriceUsd, 'sharePriceUsd')
	const sharePriceNumber = assertOptionalFiniteNumber(wire.sharePriceNumber, 'sharePriceNumber')
	const allRewards = wire.allRewards?.map(normalizeReward)
	return {
		totalAssets: assertGraphqlAmount(wire.totalAssets, 'totalAssets'),
		totalSupply: assertGraphqlAmount(wire.totalSupply, 'totalSupply'),
		lastAccrualTimestamp: wire.timestamp,
		lastIndexedBlock: assertGraphqlAmount(wire.blockNumber, 'blockNumber'),
		...(totalAssetsUsd != null && {
			totalAssetsUsd,
		}),
		...(apy != null && {
			apy,
		}),
		...(netApy != null && {
			netApy,
		}),
		...(netApyExcludingRewards != null && {
			netApyExcludingRewards,
		}),
		...(avgNetApy != null && {
			avgNetApy,
		}),
		...(avgNetApyExcludingRewards != null && {
			avgNetApyExcludingRewards,
		}),
		...(fee != null && {
			fee,
		}),
		...(sharePriceUsd != null && {
			sharePriceUsd,
		}),
		...(sharePriceNumber != null && {
			sharePriceNumber,
		}),
		...(allRewards != null && allRewards.length > 0 && {
			allRewards,
		}),
	}
}

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

/** List Morpho Blue markets filtered to supported EIP-155 chains, with authoritative `pageInfo.countTotal`. */
export const listMarkets = async ({
	binding,
	chainIds,
	limit = morphoMarketPageLimit,
}: {
	binding: SourceBinding
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
		await queryMorpho(binding, `
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
				pageInfo {
					countTotal
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
	if (data.markets.pageInfo.countTotal < data.markets.items.length)
		throw new Error(`${Source.Morpho_Graphql}: markets countTotal below page length`)

	return {
		items: data.markets.items.map((market) => (
			normalizeMarket(market, chainIds)
		)),
		countTotal: data.markets.pageInfo.countTotal,
	}
}

/** Read one Morpho Blue market by its EIP-155 chain and bytes32 market id. */
export const getMarket = async ({
	binding,
	chainId,
	marketId,
}: {
	binding: SourceBinding
	chainId: number
	marketId: string
}) => {
	assertChainId(chainId)
	const normalizedMarketId = assertMarketId(marketId)
	const data = assertEnvelope(
		'market',
		morphoGraphqlMarketDataWire,
		await queryMorpho(binding, `
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

/** List MetaMorpho vaults filtered to supported EIP-155 chains, with authoritative `pageInfo.countTotal`. */
export const listVaults = async ({
	binding,
	chainIds,
	limit = morphoVaultPageLimit,
}: {
	binding: SourceBinding
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
		await queryMorpho(binding, `
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
				pageInfo {
					countTotal
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
	if (data.vaults.pageInfo.countTotal < data.vaults.items.length)
		throw new Error(`${Source.Morpho_Graphql}: vaults countTotal below page length`)

	return {
		items: data.vaults.items.map((vault) => (
			normalizeVault(vault, chainIds)
		)),
		countTotal: data.vaults.pageInfo.countTotal,
	}
}

/** Read one MetaMorpho vault by its EIP-155 chain and vault contract address. */
export const getVault = async ({
	binding,
	chainId,
	address,
}: {
	binding: SourceBinding
	chainId: number
	address: string
}) => {
	assertChainId(chainId)
	const normalizedAddress = assertAddress(address, 'vault address')
	const data = assertEnvelope(
		'vault',
		morphoGraphqlVaultDataWire,
		await queryMorpho(binding, `
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
	binding,
	chainId,
	account,
}: {
	binding: SourceBinding
	chainId: number
	account: string
}): Promise<MorphoGraphqlAccountPosition[]> => {
	assertChainId(chainId)
	const normalizedAccount = assertAddress(account, 'account')
	const data = assertEnvelope(
		'account positions',
		morphoGraphqlAccountPositionsDataWire,
		await queryMorpho(binding, `
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
