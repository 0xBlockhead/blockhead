/**
 * Aave V3 GraphQL named operations (HTTP POST to api.v3.aave.com/graphql).
 * @see https://aave.com/docs/aave-v3/markets/data.md
 * @see https://aave.com/docs/aave-v3/getting-started/graphql.md
 */
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { aaveChainByChainId } from '$/sources/Aave/Rest/constants.ts'
import bindings from '$/sources/Aave/bindings.ts'
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

const marketEmodeFields = `
	eModeCategories {
		id
		label
		maxLTV {
			value
		}
		liquidationThreshold {
			value
		}
		liquidationPenalty {
			value
		}
	}
`

const aaveCurrencyFields = `
	address
	name
	symbol
	decimals
	imageUrl
	chainId
`

const marketReserveFields = `
	reserves {
		underlyingToken {
			${aaveCurrencyFields}
		}
		aToken {
			${aaveCurrencyFields}
		}
		vToken {
			${aaveCurrencyFields}
		}
		isFrozen
		isPaused
		flashLoanEnabled
		permitSupported
		usdExchangeRate
		usdOracleAddress
		interestRateStrategyAddress
		unbacked {
			amount {
				value
			}
			usd
		}
		isolationModeConfig {
			canBeCollateral
			canBeBorrowed
			debtCeiling {
				amount {
					value
				}
				usd
			}
			debtCeilingDecimals
			totalBorrows {
				amount {
					value
				}
				usd
			}
		}
		size {
			amount {
				value
			}
			usd
		}
		supplyInfo {
			apy {
				value
			}
			canBeCollateral
			maxLTV {
				value
			}
			liquidationThreshold {
				value
			}
			liquidationBonus {
				value
			}
			supplyCapReached
			supplyCap {
				amount {
					value
				}
				usd
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
				usd
			}
			utilizationRate {
				value
			}
			borrowCapReached
			borrowCap {
				amount {
					value
				}
				usd
			}
			total {
				amount {
					value
				}
				usd
			}
			reserveFactor {
				value
			}
			variableRateSlope1 {
				value
			}
			variableRateSlope2 {
				value
			}
			optimalUsageRate {
				value
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

const assertOptionalCurrency = (
	currency: AaveMarketSnapshotWire['reserves'][number]['aToken'],
	expectedChainId: number,
	label: string
) => {
	if (currency == null)
		return undefined
	if (currency.chainId !== expectedChainId)
		throw new Error(`${Source.Aave_Rest}: ${label} chain mismatch`)
	return {
		...currency,
		address: assertPoolAddress(currency.address),
	}
}

const assertMarketSnapshotWire = (
	market: AaveMarketSnapshotWire,
	expected: {
		chainId: number
		poolAddress: `0x${string}`
	}
) => {
	const asserted = assertMarketWire(market, expected)
	const eModeCategories = market.eModeCategories?.map((category) => {
		if (category.label.length < 1)
			throw new Error(`${Source.Aave_Rest}: eMode category missing label`)
		if (
			!decimalPattern.test(category.maxLTV.value)
			|| !decimalPattern.test(category.liquidationThreshold.value)
			|| !decimalPattern.test(category.liquidationPenalty.value)
		)
			throw new Error(`${Source.Aave_Rest}: invalid eMode decimal value`)
		return category
	})
	const reserveAddresses = new Set<string>()

	return {
		...asserted,
		...(eModeCategories != null && {
			eModeCategories,
		}),
		reserves: market.reserves.map((reserve) => {
			if (reserve.underlyingToken.chainId !== expected.chainId)
				throw new Error(`${Source.Aave_Rest}: reserve chain mismatch`)
			const address = assertPoolAddress(reserve.underlyingToken.address)
			if (reserveAddresses.has(address))
				throw new Error(`${Source.Aave_Rest}: duplicate reserve identity`)

			reserveAddresses.add(address)
			const aToken = assertOptionalCurrency(reserve.aToken, expected.chainId, 'aToken')
			const vToken = assertOptionalCurrency(reserve.vToken, expected.chainId, 'vToken')
			const usdOracleAddress = (
				reserve.usdOracleAddress != null && reserve.usdOracleAddress.length > 0 ?
					assertPoolAddress(reserve.usdOracleAddress)
				:
					undefined
			)
			const interestRateStrategyAddress = (
				reserve.interestRateStrategyAddress != null && reserve.interestRateStrategyAddress.length > 0 ?
					assertPoolAddress(reserve.interestRateStrategyAddress)
				:
					undefined
			)
			if (
				!decimalPattern.test(reserve.size.amount.value)
				|| (
					reserve.size.usd != null
					&& !decimalPattern.test(reserve.size.usd)
				)
				|| !decimalPattern.test(reserve.supplyInfo.apy.value)
				|| (
					reserve.supplyInfo.maxLTV != null
					&& !decimalPattern.test(reserve.supplyInfo.maxLTV.value)
				)
				|| (
					reserve.supplyInfo.liquidationThreshold != null
					&& !decimalPattern.test(reserve.supplyInfo.liquidationThreshold.value)
				)
				|| (
					reserve.supplyInfo.liquidationBonus != null
					&& !decimalPattern.test(reserve.supplyInfo.liquidationBonus.value)
				)
				|| (
					reserve.supplyInfo.supplyCap != null
					&& (
						!decimalPattern.test(reserve.supplyInfo.supplyCap.amount.value)
						|| (
							reserve.supplyInfo.supplyCap.usd != null
							&& !decimalPattern.test(reserve.supplyInfo.supplyCap.usd)
						)
					)
				)
				|| (
					reserve.usdExchangeRate != null
					&& !decimalPattern.test(reserve.usdExchangeRate)
				)
				|| (
					reserve.unbacked != null
					&& (
						!decimalPattern.test(reserve.unbacked.amount.value)
						|| (
							reserve.unbacked.usd != null
							&& !decimalPattern.test(reserve.unbacked.usd)
						)
					)
				)
				|| (
					reserve.isolationModeConfig != null
					&& (
						!decimalPattern.test(reserve.isolationModeConfig.debtCeiling.amount.value)
						|| (
							reserve.isolationModeConfig.totalBorrows != null
							&& !decimalPattern.test(reserve.isolationModeConfig.totalBorrows.amount.value)
						)
					)
				)
				|| (
					reserve.borrowInfo != null
					&& (
						!decimalPattern.test(reserve.borrowInfo.apy.value)
						|| !decimalPattern.test(reserve.borrowInfo.availableLiquidity.amount.value)
						|| (
							reserve.borrowInfo.utilizationRate != null
							&& !decimalPattern.test(reserve.borrowInfo.utilizationRate.value)
						)
						|| (
							reserve.borrowInfo.borrowCap != null
							&& (
								!decimalPattern.test(reserve.borrowInfo.borrowCap.amount.value)
								|| (
									reserve.borrowInfo.borrowCap.usd != null
									&& !decimalPattern.test(reserve.borrowInfo.borrowCap.usd)
								)
							)
						)
						|| (
							reserve.borrowInfo.total != null
							&& (
								!decimalPattern.test(reserve.borrowInfo.total.amount.value)
								|| (
									reserve.borrowInfo.total.usd != null
									&& !decimalPattern.test(reserve.borrowInfo.total.usd)
								)
							)
						)
						|| (
							reserve.borrowInfo.reserveFactor != null
							&& !decimalPattern.test(reserve.borrowInfo.reserveFactor.value)
						)
						|| (
							reserve.borrowInfo.variableRateSlope1 != null
							&& !decimalPattern.test(reserve.borrowInfo.variableRateSlope1.value)
						)
						|| (
							reserve.borrowInfo.variableRateSlope2 != null
							&& !decimalPattern.test(reserve.borrowInfo.variableRateSlope2.value)
						)
						|| (
							reserve.borrowInfo.optimalUsageRate != null
							&& !decimalPattern.test(reserve.borrowInfo.optimalUsageRate.value)
						)
					)
				)
			)
				throw new Error(`${Source.Aave_Rest}: invalid reserve decimal value`)

			const {
				aToken: _aToken,
				vToken: _vToken,
				usdOracleAddress: _usdOracleAddress,
				interestRateStrategyAddress: _interestRateStrategyAddress,
				...reserveRest
			} = reserve

			return {
				...reserveRest,
				underlyingToken: {
					...reserve.underlyingToken,
					address,
				},
				...(aToken != null && {
					aToken,
				}),
				...(vToken != null && {
					vToken,
				}),
				...(usdOracleAddress != null && {
					usdOracleAddress,
				}),
				...(interestRateStrategyAddress != null && {
					interestRateStrategyAddress,
				}),
			}
		}),
	}
}

/** List Aave markets for one or more supported EIP-155 chain ids. */
export const listMarkets = async ({
	binding: sourceBinding = binding,
	chainIds,
}: {
	binding?: SourceBinding
	chainIds: readonly number[]
}) => {
	if (chainIds.length < 1)
		throw new Error(`${Source.Aave_Rest}: chainIds required`)
	if (new Set(chainIds).size !== chainIds.length)
		throw new Error(`${Source.Aave_Rest}: duplicate chain ids`)
	for (const chainId of chainIds)
		assertChainId(chainId)

	const data = await graphql<AaveMarketsData>({
		binding: sourceBinding,
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

	const marketIdentities = new Set<string>()
	return data.markets.map((market) => {
		if (!chainIds.includes(market.chain.chainId))
			throw new Error(`${Source.Aave_Rest}: market chain filter violated`)

		const asserted = assertMarketWire(market)
		const identity = `${String(asserted.chain.chainId)}:${asserted.address}`
		if (marketIdentities.has(identity))
			throw new Error(`${Source.Aave_Rest}: duplicate market identity`)

		marketIdentities.add(identity)
		return asserted
	})
}

/**
 * Fetch one Aave market and its reserve snapshot by pool address and chain id.
 * @see https://aave.com/docs/aave-v3/markets/data.md
 */
export const getMarket = async ({
	binding: sourceBinding = binding,
	chainId,
	poolAddress,
}: {
	binding?: SourceBinding
	chainId: number
	poolAddress: string
}) => {
	assertChainId(chainId)
	const normalizedPoolAddress = assertPoolAddress(poolAddress)

	const data = await graphql<AaveMarketData>({
		binding: sourceBinding,
		query: `
			query Market($request: MarketRequest!) {
				market(request: $request) {
					${marketFields}
					${marketEmodeFields}
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
		...(currency.name != null && currency.name.length > 0 && {
			name: currency.name,
		}),
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
	binding: sourceBinding = binding,
	chainId,
	account,
}: {
	binding?: SourceBinding
	chainId: number
	account: string
}): Promise<AaveAccountPosition[]> => {
	assertChainId(chainId)
	const normalizedAccount = assertAccount(account)
	const markets = await listMarkets({
		binding: sourceBinding,
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
		binding: sourceBinding,
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
						name
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
						name
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
	const positions = [
		...data.userSupplies.map((wire) => normalizeSupplyPosition(wire, expected)),
		...data.userBorrows.map((wire) => normalizeBorrowPosition(wire, expected)),
	].filter((position) => position != null)
	const positionIdentities = new Set<string>()
	for (const position of positions) {
		const identity = `${position.kind}:${position.poolAddress}:${position.underlyingTokenAddress}`
		if (positionIdentities.has(identity))
			throw new Error(`${Source.Aave_Rest}: duplicate account position identity`)

		positionIdentities.add(identity)
	}
	return positions
}
