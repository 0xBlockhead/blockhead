/**
 * Aave V3 GraphQL named operations (HTTP POST to api.v3.aave.com/graphql).
 * @see https://aave.com/docs/aave-v3/markets/data.md
 * @see https://aave.com/docs/aave-v3/getting-started/graphql.md
 */
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/Aave/bindings.ts'
import { aaveChainByChainId } from '$/sources/Aave/Rest/constants.ts'
import type {
	AaveAccountBorrowPosition,
	AaveAccountPosition,
	AaveAccountPositionsData,
	AaveAccountSupplyPosition,
	AaveMarketData,
	AaveMarketSnapshotWire,
	AaveMarketWire,
	AaveMarketsData,
	AaveUserBorrowPositionWire,
	AaveUserSupplyPositionWire,
} from '$/sources/Aave/Rest/types.ts'
import {
	aaveAccountPositionsEnvelope,
	aaveMarketEnvelope,
	aaveMarketsEnvelope,
} from '$/sources/Aave/Rest/types.ts'
import { graphql } from '$/sources/_shared/wire/Graphql/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Aave_Rest][0]

const marketFields = `
	name
	address
	icon
	totalMarketSize
	totalAvailableLiquidity
	chain {
		chainId
		name
		icon
	}
`

const marketReserveFields = `
	reserves {
		underlyingToken {
			address
			name
			symbol
			decimals
			imageUrl
			chainId
		}
		isFrozen
		isPaused
		size {
			amount {
				value
			}
		}
		supplyInfo {
			apy {
				value
			}
		}
		borrowInfo {
			apy {
				value
			}
			availableLiquidity {
				amount {
					value
				}
			}
		}
	}
`

const decimalPattern = /^(?:0|[1-9]\d*)(?:\.\d+)?$/

const assertChainId = (chainId: number) => {
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Aave_Rest}: invalid chain id ${String(chainId)}`)
	if (aaveChainByChainId[chainId] == null)
		throw new Error(`${Source.Aave_Rest}: unsupported chain id ${String(chainId)}`)
}

const assertPoolAddress = (poolAddress: string) => {
	const normalized = hexLowerOfByteSize(poolAddress, 20)
	if (normalized == null)
		throw new Error(`${Source.Aave_Rest}: invalid pool address ${poolAddress}`)
	return normalized
}

const assertEnvelope = (
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(value)
	} catch {
		throw new Error(`${Source.Aave_Rest}: invalid ${label} response envelope`)
	}
}

const assertMarketWire = (
	market: AaveMarketWire,
	expected?: {
		chainId: number
		poolAddress: `0x${string}`
	}
) => {
	assertChainId(market.chain.chainId)
	const address = assertPoolAddress(market.address)
	if (market.name.length < 1)
		throw new Error(`${Source.Aave_Rest}: market missing name`)
	if (market.icon.length < 1)
		throw new Error(`${Source.Aave_Rest}: market missing icon`)
	if (market.totalMarketSize.length < 1)
		throw new Error(`${Source.Aave_Rest}: market missing totalMarketSize`)
	if (market.totalAvailableLiquidity.length < 1)
		throw new Error(`${Source.Aave_Rest}: market missing totalAvailableLiquidity`)
	if (expected != null) {
		if (market.chain.chainId !== expected.chainId)
			throw new Error(`${Source.Aave_Rest}: market chain mismatch`)
		if (address !== expected.poolAddress)
			throw new Error(`${Source.Aave_Rest}: market address mismatch`)
	}
	return {
		...market,
		address,
	}
}

const assertMarketSnapshotWire = (
	market: AaveMarketSnapshotWire,
	expected: {
		chainId: number
		poolAddress: `0x${string}`
	}
) => ({
	...assertMarketWire(market, expected),
	reserves: market.reserves.map((reserve) => {
		if (reserve.underlyingToken.chainId !== expected.chainId)
			throw new Error(`${Source.Aave_Rest}: reserve chain mismatch`)
		const address = assertPoolAddress(reserve.underlyingToken.address)
		if (
			!decimalPattern.test(reserve.size.amount.value)
			|| !decimalPattern.test(reserve.supplyInfo.apy.value)
			|| (
				reserve.borrowInfo != null
				&& (
					!decimalPattern.test(reserve.borrowInfo.apy.value)
					|| !decimalPattern.test(reserve.borrowInfo.availableLiquidity.amount.value)
				)
			)
		)
			throw new Error(`${Source.Aave_Rest}: invalid reserve decimal value`)

		return {
			...reserve,
			underlyingToken: {
				...reserve.underlyingToken,
				address,
			},
		}
	}),
})

/** List Aave markets for one or more supported EIP-155 chain ids. */
export const listMarkets = async ({
	chainIds,
}: {
	chainIds: readonly number[]
}) => {
	if (chainIds.length < 1)
		throw new Error(`${Source.Aave_Rest}: chainIds required`)
	for (const chainId of chainIds)
		assertChainId(chainId)

	const data = await graphql<AaveMarketsData>({
		binding,
		query: `
			query Markets($request: MarketsRequest!) {
				markets(request: $request) {
					${marketFields}
				}
			}
		`,
		variables: {
			request: {
				chainIds: [
					...chainIds,
				],
			},
		},
	})
	if (data == null)
		throw new Error(`${Source.Aave_Rest}: markets response missing data`)
	if (data.markets == null)
		throw new Error(`${Source.Aave_Rest}: markets response missing markets`)
	assertEnvelope(aaveMarketsEnvelope, data.markets, 'markets')

	return data.markets.map((market) => {
		if (!chainIds.includes(market.chain.chainId))
			throw new Error(`${Source.Aave_Rest}: market chain filter violated`)

		return assertMarketWire(market)
	})
}

/**
 * Fetch one Aave market and its reserve snapshot by pool address and chain id.
 * @see https://aave.com/docs/aave-v3/markets/data.md
 */
export const getMarket = async ({
	chainId,
	poolAddress,
}: {
	chainId: number
	poolAddress: string
}) => {
	assertChainId(chainId)
	const normalizedPoolAddress = assertPoolAddress(poolAddress)

	const data = await graphql<AaveMarketData>({
		binding,
		query: `
			query Market($request: MarketRequest!) {
				market(request: $request) {
					${marketFields}
					${marketReserveFields}
				}
			}
		`,
		variables: {
			request: {
				address: normalizedPoolAddress,
				chainId,
			},
		},
	})
	if (data == null)
		throw new Error(`${Source.Aave_Rest}: market response missing data`)
	if (data.market === undefined)
		throw new Error(`${Source.Aave_Rest}: market response missing market`)
	if (data.market == null)
		throw new Error(`${Source.Aave_Rest}: market not found ${normalizedPoolAddress} on chain ${String(chainId)}`)
	assertEnvelope(aaveMarketEnvelope, data.market, 'market')

	return assertMarketSnapshotWire(data.market, {
		chainId,
		poolAddress: normalizedPoolAddress,
	})
}

const assertAccount = (account: string) => {
	const normalized = hexLowerOfByteSize(account, 20)
	if (normalized == null)
		throw new Error(`${Source.Aave_Rest}: invalid account ${account}`)
	return normalized
}

const assertCurrency = (
	currency: AaveUserSupplyPositionWire['currency'] | AaveUserBorrowPositionWire['currency'],
	expectedChainId: number
) => {
	if (currency.chainId !== expectedChainId)
		throw new Error(`${Source.Aave_Rest}: account position currency chain mismatch`)
	if (currency.symbol.length < 1)
		throw new Error(`${Source.Aave_Rest}: account position missing currency symbol`)
	if (!Number.isSafeInteger(currency.decimals) || currency.decimals < 0)
		throw new Error(`${Source.Aave_Rest}: account position missing currency decimals`)
	return {
		underlyingTokenAddress: assertPoolAddress(currency.address),
		symbol: currency.symbol,
		decimals: currency.decimals,
	}
}

const assertDecimalAmount = (
	value: string | undefined,
	label: string
) => {
	if (value == null || value.length < 1 || !decimalPattern.test(value))
		throw new Error(`${Source.Aave_Rest}: account position missing ${label}`)
	return value
}

const assertBoolean = (
	value: boolean | undefined,
	label: string
) => {
	if (value !== true && value !== false)
		throw new Error(`${Source.Aave_Rest}: account position missing ${label}`)
	return value
}

const normalizeSupplyPosition = (
	wire: AaveUserSupplyPositionWire,
	expected: {
		chainId: number
		account: `0x${string}`
		poolAddresses: ReadonlySet<`0x${string}`>
	}
): AaveAccountSupplyPosition | null => {
	if (wire.market.chain.chainId !== expected.chainId)
		throw new Error(`${Source.Aave_Rest}: account supply position chain mismatch`)
	const poolAddress = assertPoolAddress(wire.market.address)
	if (!expected.poolAddresses.has(poolAddress))
		throw new Error(`${Source.Aave_Rest}: account supply position market filter violated`)
	const balance = assertDecimalAmount(wire.balance.amount.value, 'balance')
	if (balance === '0')
		return null

	const currency = assertCurrency(wire.currency, expected.chainId)
	return {
		protocol: 'Aave V3',
		kind: 'supply',
		chainId: expected.chainId,
		account: expected.account,
		poolAddress,
		...currency,
		balance,
		balanceUsd: assertDecimalAmount(wire.balance.usd, 'balanceUsd'),
		apy: assertDecimalAmount(wire.apy.value, 'apy'),
		isCollateral: assertBoolean(wire.isCollateral, 'isCollateral'),
		canBeCollateral: assertBoolean(wire.canBeCollateral, 'canBeCollateral'),
	}
}

const normalizeBorrowPosition = (
	wire: AaveUserBorrowPositionWire,
	expected: {
		chainId: number
		account: `0x${string}`
		poolAddresses: ReadonlySet<`0x${string}`>
	}
): AaveAccountBorrowPosition | null => {
	if (wire.market.chain.chainId !== expected.chainId)
		throw new Error(`${Source.Aave_Rest}: account borrow position chain mismatch`)
	const poolAddress = assertPoolAddress(wire.market.address)
	if (!expected.poolAddresses.has(poolAddress))
		throw new Error(`${Source.Aave_Rest}: account borrow position market filter violated`)
	const debt = assertDecimalAmount(wire.debt.amount.value, 'debt')
	if (debt === '0')
		return null

	const currency = assertCurrency(wire.currency, expected.chainId)
	return {
		protocol: 'Aave V3',
		kind: 'borrow',
		chainId: expected.chainId,
		account: expected.account,
		poolAddress,
		...currency,
		debt,
		debtUsd: assertDecimalAmount(wire.debt.usd, 'debtUsd'),
		apy: assertDecimalAmount(wire.apy.value, 'apy'),
	}
}

/**
 * Account supply + borrow reserve positions across every Aave market on one chain.
 * Discovers pool addresses via `markets`, then reads documented `userSupplies` / `userBorrows`.
 * @see https://aave.com/docs/aave-v3/markets/data.md
 * @see https://aave.com/docs/aave-v3/getting-started/graphql.md
 */
export const getAccountPositions = async ({
	chainId,
	account,
}: {
	chainId: number
	account: string
}): Promise<AaveAccountPosition[]> => {
	assertChainId(chainId)
	const normalizedAccount = assertAccount(account)
	const markets = await listMarkets({
		chainIds: [
			chainId,
		],
	})
	if (markets.length < 1)
		return []

	const marketRefs = markets.map((market) => ({
		address: market.address,
		chainId,
	}))
	const poolAddresses = new Set(markets.map((market) => market.address))

	const data = await graphql<AaveAccountPositionsData>({
		binding,
		query: `
			query AccountPositions(
				$supplies: UserSuppliesRequest!,
				$borrows: UserBorrowsRequest!
			) {
				userSupplies(request: $supplies) {
					market {
						address
						chain {
							chainId
						}
					}
					currency {
						address
						symbol
						decimals
						chainId
					}
					balance {
						amount {
							value
						}
						usd
					}
					apy {
						value
					}
					isCollateral
					canBeCollateral
				}
				userBorrows(request: $borrows) {
					market {
						address
						chain {
							chainId
						}
					}
					currency {
						address
						symbol
						decimals
						chainId
					}
					debt {
						amount {
							value
						}
						usd
					}
					apy {
						value
					}
				}
			}
		`,
		variables: {
			supplies: {
				markets: marketRefs,
				user: normalizedAccount,
				collateralsOnly: false,
				orderBy: {
					name: 'ASC',
				},
			},
			borrows: {
				markets: marketRefs,
				user: normalizedAccount,
				orderBy: {
					name: 'ASC',
				},
			},
		},
	})
	if (data == null)
		throw new Error(`${Source.Aave_Rest}: account positions response missing data`)
	assertEnvelope(aaveAccountPositionsEnvelope, data, 'account positions')

	const expected = {
		chainId,
		account: normalizedAccount,
		poolAddresses,
	}
	return [
		...data.userSupplies.map((wire) => normalizeSupplyPosition(wire, expected)),
		...data.userBorrows.map((wire) => normalizeBorrowPosition(wire, expected)),
	].filter((position) => position != null)
}
