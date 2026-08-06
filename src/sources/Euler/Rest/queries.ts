/**
 * Euler Data v3 EVK vault REST named operations.
 * @see https://docs.euler.finance/developers/data-querying/euler-v3-api
 * @see https://v3.euler.finance/v3/openapi.json
 */
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/Euler/bindings.ts'
import {
	eulerEvkByChainId,
	eulerVaultListDefaultLimit,
	eulerVaultListMaxLimit,
} from '$/sources/Euler/Rest/constants.ts'
import type {
	EulerAccountPosition,
	EulerAccountPositionLiquidity,
	EulerAccountPositionLiquidityWire,
	EulerAccountPositionWire,
	EulerAccountPositionsResponse,
	EulerEvkVaultDetail,
	EulerEvkVaultSummary,
	EulerVaultDetailResponse,
	EulerVaultDetailWire,
	EulerVaultListResponse,
	EulerVaultSummaryWire,
} from '$/sources/Euler/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const binding = bindings[Source.Euler_Rest][0]

const assertChainId = (chainId: number) => {
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Euler_Rest}: invalid chain id ${String(chainId)}`)
	if (eulerEvkByChainId[chainId] == null)
		throw new Error(`${Source.Euler_Rest}: unsupported chain id ${String(chainId)}`)
}

const assertVaultAddress = (vaultAddress: string | undefined) => {
	const normalized = hexLowerOfByteSize(vaultAddress, 20)
	if (normalized == null)
		throw new Error(`${Source.Euler_Rest}: invalid vault address ${String(vaultAddress)}`)
	return normalized
}

const assertOptionalAddress = (
	value: string | undefined,
	label: string
) => {
	if (value == null || value.length < 1)
		return undefined

	const normalized = hexLowerOfByteSize(value, 20)
	if (normalized == null)
		throw new Error(`${Source.Euler_Rest}: invalid ${label} ${value}`)
	return normalized
}

const assertAddress = (
	value: string | undefined,
	label: string
) => {
	if (value == null || value.length < 1)
		throw new Error(`${Source.Euler_Rest}: vault missing ${label}`)

	const normalized = hexLowerOfByteSize(value, 20)
	if (normalized == null)
		throw new Error(`${Source.Euler_Rest}: invalid ${label} ${value}`)
	return normalized
}

const assertBoolean = (value: boolean | undefined, label: string) => {
	if (value == null)
		throw new Error(`${Source.Euler_Rest}: account position missing ${label}`)
	return value
}

const assertString = (value: string | undefined, label: string) => {
	if (value == null || value.length < 1)
		throw new Error(`${Source.Euler_Rest}: account position missing ${label}`)
	return value
}

const assertObject = <T extends object>(value: T | undefined, label: string) => {
	if (value == null)
		throw new Error(`${Source.Euler_Rest}: account position missing ${label}`)
	return value
}

const assertLiquidityValue = (
	value: {
		value?: string
		valueUsd?: number
	} | undefined,
	label: string
) => {
	if (value == null)
		return undefined
	if (value.value == null || value.value.length < 1)
		throw new Error(`${Source.Euler_Rest}: account position missing ${label}.value`)

	return {
		value: assertNonNegativeDecimalString(value.value, `${label}.value`),
		...(value.valueUsd != null && {
			valueUsd: assertFiniteNumber(value.valueUsd, `${label}.valueUsd`),
		}),
	}
}

const assertAccountPositionLiquidity = (
	liquidity: EulerAccountPositionLiquidityWire | null | undefined
): EulerAccountPositionLiquidity => {
	if (liquidity == null)
		return null

	const daysToLiquidation = liquidity.daysToLiquidation
	if (
		daysToLiquidation == null
		|| (
			daysToLiquidation !== 'Infinity'
			&& daysToLiquidation !== 'MoreThanAYear'
			&& !Number.isFinite(daysToLiquidation)
		)
	)
		throw new Error(`${Source.Euler_Rest}: account position missing liquidity.daysToLiquidation`)

	return {
		vaultAddress: assertAddress(liquidity.vaultAddress, 'liquidity.vaultAddress'),
		unitOfAccount: assertAddress(liquidity.unitOfAccount, 'liquidity.unitOfAccount'),
		daysToLiquidation,
		...(assertLiquidityValue(liquidity.liabilityValue, 'liquidity.liabilityValue') != null && {
			liabilityValue: assertLiquidityValue(liquidity.liabilityValue, 'liquidity.liabilityValue'),
		}),
		...(assertLiquidityValue(liquidity.totalCollateralValue, 'liquidity.totalCollateralValue') != null && {
			totalCollateralValue: assertLiquidityValue(liquidity.totalCollateralValue, 'liquidity.totalCollateralValue'),
		}),
		collaterals: (liquidity.collaterals ?? []).map((collateral, index) => ({
			address: assertAddress(collateral.address, `liquidity.collaterals[${String(index)}].address`),
			...(assertLiquidityValue(collateral.value, `liquidity.collaterals[${String(index)}].value`) != null && {
				value: assertLiquidityValue(collateral.value, `liquidity.collaterals[${String(index)}].value`),
			}),
			...(collateral.marketPriceUsd != null && {
				marketPriceUsd: assertFiniteNumber(collateral.marketPriceUsd, `liquidity.collaterals[${String(index)}].marketPriceUsd`),
			}),
			...(collateral.valueUsd != null && {
				valueUsd: assertFiniteNumber(collateral.valueUsd, `liquidity.collaterals[${String(index)}].valueUsd`),
			}),
		})),
	}
}

const assertAccountPositionWire = (
	wire: EulerAccountPositionWire,
	expected: {
		chainId: number
		account: `0x${string}`
	}
): EulerAccountPosition => {
	if (wire.chainId !== expected.chainId)
		throw new Error(`${Source.Euler_Rest}: account position chain mismatch`)
	const account = assertAddress(wire.account, 'account')
	if (account !== expected.account)
		throw new Error(`${Source.Euler_Rest}: account position account mismatch`)
	const vaultAddress = assertAddress(wire.vault, 'vault')
	if (wire.vaultType == null || wire.vaultType.length < 1)
		throw new Error(`${Source.Euler_Rest}: account position missing vaultType`)
	const assetAddress = assertAddress(wire.asset, 'asset')
	const subAccount = assertObject(wire.subAccount, 'subAccount')
	const snapshot = assertObject(wire.snapshot, 'snapshot')

	return {
		chainId: expected.chainId,
		account,
		vaultAddress,
		vaultType: wire.vaultType,
		assetAddress,
		shares: assertNonNegativeDecimalString(wire.shares, 'shares'),
		assets: assertNonNegativeDecimalString(wire.assets, 'assets'),
		borrowed: assertNonNegativeDecimalString(wire.borrowed, 'borrowed'),
		assetsValue: assertNonNegativeDecimalString(wire.assetsValue, 'assetsValue'),
		debtValue: assertNonNegativeDecimalString(wire.debtValue, 'debtValue'),
		isCollateral: assertBoolean(wire.isCollateral, 'isCollateral'),
		balanceForwarderEnabled: assertBoolean(wire.balanceForwarderEnabled, 'balanceForwarderEnabled'),
		isController: assertBoolean(wire.isController, 'isController'),
		liquidity: assertAccountPositionLiquidity(wire.liquidity),
		subAccount: {
			owner: assertAddress(subAccount.owner, 'subAccount.owner'),
			timestamp: assertString(subAccount.timestamp, 'subAccount.timestamp'),
			lastAccountStatusCheckTimestamp: assertString(subAccount.lastAccountStatusCheckTimestamp, 'subAccount.lastAccountStatusCheckTimestamp'),
			enabledControllers: (subAccount.enabledControllers ?? []).map((address) => assertAddress(address, 'subAccount.enabledControllers')),
			enabledCollaterals: (subAccount.enabledCollaterals ?? []).map((address) => assertAddress(address, 'subAccount.enabledCollaterals')),
			isLockdownMode: assertBoolean(subAccount.isLockdownMode, 'subAccount.isLockdownMode'),
			isPermitDisabledMode: assertBoolean(subAccount.isPermitDisabledMode, 'subAccount.isPermitDisabledMode'),
		},
		snapshot: {
			timestamp: assertString(snapshot.timestamp, 'snapshot.timestamp'),
			ageSeconds: assertFiniteNumber(snapshot.ageSeconds, 'snapshot.ageSeconds'),
			source: assertString(snapshot.source, 'snapshot.source'),
			method: assertString(snapshot.method, 'snapshot.method'),
		},
	}
}

const assertNonNegativeDecimalString = (
	value: string | undefined,
	label: string
) => {
	if (value == null || value.length < 1 || !/^(?:0|[1-9]\d*)$/.test(value))
		throw new Error(`${Source.Euler_Rest}: vault missing ${label}`)
	return value
}

const assertFiniteNumber = (
	value: number | undefined,
	label: string
) => {
	if (value == null || !Number.isFinite(value))
		throw new Error(`${Source.Euler_Rest}: vault missing ${label}`)
	return value
}

const assertSummaryWire = (
	wire: EulerVaultSummaryWire,
	expected: {
		chainId: number
		vaultAddress: `0x${string}`
	}
): EulerEvkVaultSummary => {
	if (wire.vaultType !== 'evk')
		throw new Error(`${Source.Euler_Rest}: vault type ${wire.vaultType} is not evk`)
	if (wire.chainId == null)
		throw new Error(`${Source.Euler_Rest}: vault missing chainId`)
	if (wire.chainId !== expected.chainId)
		throw new Error(`${Source.Euler_Rest}: vault chain mismatch`)
	if (wire.name == null || wire.name.length < 1)
		throw new Error(`${Source.Euler_Rest}: vault missing name`)
	if (wire.symbol == null || wire.symbol.length < 1)
		throw new Error(`${Source.Euler_Rest}: vault missing symbol`)
	if (wire.decimals == null || !Number.isSafeInteger(wire.decimals) || wire.decimals < 0)
		throw new Error(`${Source.Euler_Rest}: vault missing decimals`)
	if (wire.asset == null)
		throw new Error(`${Source.Euler_Rest}: vault missing asset`)
	if (wire.asset.symbol == null || wire.asset.symbol.length < 1)
		throw new Error(`${Source.Euler_Rest}: vault missing asset symbol`)
	if (wire.createdAt == null || wire.createdAt.length < 1)
		throw new Error(`${Source.Euler_Rest}: vault missing createdAt`)

	const vaultAddress = assertVaultAddress(wire.address)
	if (vaultAddress !== expected.vaultAddress)
		throw new Error(`${Source.Euler_Rest}: vault address mismatch`)

	const assetName = wire.asset.name?.trim()
	const assetDecimals = wire.asset.decimals

	return {
		chainId: wire.chainId,
		vaultAddress,
		vaultType: 'evk',
		name: wire.name,
		symbol: wire.symbol,
		decimals: wire.decimals,
		assetAddress: assertVaultAddress(wire.asset.address),
		assetSymbol: wire.asset.symbol,
		...(assetName != null && assetName !== '' && {
			assetName,
		}),
		...(
			assetDecimals != null
			&& Number.isSafeInteger(assetDecimals)
			&& assetDecimals >= 0
			&& {
				assetDecimals,
			}
		),
		totalAssets: assertNonNegativeDecimalString(wire.totalAssets, 'totalAssets'),
		totalBorrows: assertNonNegativeDecimalString(wire.totalBorrows, 'totalBorrows'),
		totalSupplyUsd: assertFiniteNumber(wire.totalSupplyUsd, 'totalSupplyUsd'),
		totalBorrowsUsd: assertFiniteNumber(wire.totalBorrowsUsd, 'totalBorrowsUsd'),
		utilization: assertFiniteNumber(wire.utilization, 'utilization'),
		supplyApy: assertFiniteNumber(wire.supplyApy, 'supplyApy'),
		borrowApy: assertFiniteNumber(wire.borrowApy, 'borrowApy'),
		createdAt: wire.createdAt,
		...(wire.snapshotTimestamp != null && wire.snapshotTimestamp.length > 0 && {
			snapshotTimestamp: wire.snapshotTimestamp,
		}),
	}
}

const assertDetailWire = (
	wire: EulerVaultDetailWire,
	expected: {
		chainId: number
		vaultAddress: `0x${string}`
	}
): EulerEvkVaultDetail => {
	const summary = assertSummaryWire(wire, expected)
	const dTokenAddress = assertOptionalAddress(wire.dToken, 'dToken')
	const governorAddress = assertOptionalAddress(wire.governor, 'governor')
	const governorAdminAddress = assertOptionalAddress(wire.governorAdmin, 'governorAdmin')
	const creatorAddress = assertOptionalAddress(wire.creator, 'creator')
	const unitOfAccountAddress = (
		wire.unitOfAccount == null ?
			undefined
		:
			assertOptionalAddress(wire.unitOfAccount.address, 'unitOfAccount')
	)
	const unitOfAccountSymbol = wire.unitOfAccount?.symbol?.trim()
	const oracleName = wire.oracle?.name?.trim()
	const governorFeeReceiver = assertOptionalAddress(wire.fees?.governorFeeReceiver, 'governorFeeReceiver')
	const protocolFeeReceiver = assertOptionalAddress(wire.fees?.protocolFeeReceiver, 'protocolFeeReceiver')
	const exchangeRate = wire.exchangeRate?.trim()

	return {
		...summary,
		...(dTokenAddress != null && {
			dTokenAddress,
		}),
		...(wire.oracle != null && {
			oracleAddress: assertAddress(wire.oracle.oracle, 'oracle'),
			...(oracleName != null && oracleName !== '' && {
				oracleName,
			}),
		}),
		...(governorAddress != null && {
			governorAddress,
		}),
		...(governorAdminAddress != null && {
			governorAdminAddress,
		}),
		...(creatorAddress != null && {
			creatorAddress,
		}),
		...(unitOfAccountAddress != null && {
			unitOfAccountAddress,
		}),
		...(unitOfAccountSymbol != null && unitOfAccountSymbol !== '' && {
			unitOfAccountSymbol,
		}),
		...(wire.supplyCap != null && {
			supplyCap: assertNonNegativeDecimalString(wire.supplyCap, 'supplyCap'),
		}),
		...(wire.borrowCap != null && {
			borrowCap: assertNonNegativeDecimalString(wire.borrowCap, 'borrowCap'),
		}),
		...(wire.totalShares != null && {
			totalShares: assertNonNegativeDecimalString(wire.totalShares, 'totalShares'),
		}),
		...(wire.totalBorrowed != null && {
			totalBorrowed: assertNonNegativeDecimalString(wire.totalBorrowed, 'totalBorrowed'),
		}),
		...(wire.totalCash != null && {
			totalCash: assertNonNegativeDecimalString(wire.totalCash, 'totalCash'),
		}),
		...(wire.cash != null && {
			cash: assertNonNegativeDecimalString(wire.cash, 'cash'),
		}),
		...(wire.interestRate != null && {
			interestRate: assertNonNegativeDecimalString(wire.interestRate, 'interestRate'),
		}),
		...(wire.interestAccumulator != null && {
			interestAccumulator: assertNonNegativeDecimalString(wire.interestAccumulator, 'interestAccumulator'),
		}),
		...(wire.accumulatedFees != null && {
			accumulatedFees: assertNonNegativeDecimalString(wire.accumulatedFees, 'accumulatedFees'),
		}),
		...(wire.fees != null && {
			interestFee: assertFiniteNumber(wire.fees.interestFee, 'interestFee'),
			...(wire.fees.accumulatedFeesShares != null && {
				accumulatedFeesShares: assertNonNegativeDecimalString(wire.fees.accumulatedFeesShares, 'accumulatedFeesShares'),
			}),
			...(wire.fees.accumulatedFeesAssets != null && {
				accumulatedFeesAssets: assertNonNegativeDecimalString(wire.fees.accumulatedFeesAssets, 'accumulatedFeesAssets'),
			}),
			...(governorFeeReceiver != null && {
				governorFeeReceiver,
			}),
			...(protocolFeeReceiver != null && {
				protocolFeeReceiver,
			}),
			...(wire.fees.protocolFeeShare != null && {
				protocolFeeShare: assertFiniteNumber(wire.fees.protocolFeeShare, 'protocolFeeShare'),
			}),
		}),
		...(wire.interestRates != null && {
			...(wire.interestRates.borrowSPY != null && wire.interestRates.borrowSPY.length > 0 && {
				borrowSpy: wire.interestRates.borrowSPY,
			}),
			...(wire.interestRates.borrowAPY != null && wire.interestRates.borrowAPY.length > 0 && {
				borrowApyExact: wire.interestRates.borrowAPY,
			}),
			...(wire.interestRates.supplyAPY != null && wire.interestRates.supplyAPY.length > 0 && {
				supplyApyExact: wire.interestRates.supplyAPY,
			}),
		}),
		...(wire.createdAtBlock != null && {
			createdAtBlock: assertString(wire.createdAtBlock, 'createdAtBlock'),
		}),
		...(wire.timestamp != null && wire.timestamp.length > 0 && {
			observationTimestamp: wire.timestamp,
		}),
		...(wire.evcCompatibleAsset != null && {
			evcCompatibleAsset: wire.evcCompatibleAsset,
		}),
		...(exchangeRate != null && exchangeRate !== '' && {
			exchangeRate,
		}),
	}
}

const assertLimit = (limit: number) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > eulerVaultListMaxLimit)
		throw new Error(`${Source.Euler_Rest}: limit must be 1..${String(eulerVaultListMaxLimit)}`)
	return limit
}

const assertOffset = (offset: number) => {
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error(`${Source.Euler_Rest}: offset must be a non-negative integer`)
	return offset
}

/** List EVK vault summaries for one supported EIP-155 chain. */
export const listVaults = async ({
	chainId,
	limit = eulerVaultListDefaultLimit,
	offset = 0,
}: {
	chainId: number
	limit?: number
	offset?: number
}) => {
	assertChainId(chainId)
	assertLimit(limit)
	assertOffset(offset)

	const response = await sourceGetJson<EulerVaultListResponse>(
		binding,
		httpUrl(binding, '/v3/evk/vaults', {
			chainId,
			limit,
			offset,
		})
	)
	if (response.data == null)
		throw new Error(`${Source.Euler_Rest}: vault list response missing data`)

	return response.data.map((wire) => assertSummaryWire(wire, {
		chainId,
		vaultAddress: assertVaultAddress(wire.address),
	}))
}

/** Fetch canonical EVK vault detail by chain id and vault address. */
export const getVault = async ({
	chainId,
	vaultAddress,
}: {
	chainId: number
	vaultAddress: string
}) => {
	assertChainId(chainId)
	const normalizedVaultAddress = assertVaultAddress(vaultAddress)

	const response = await sourceGetJson<EulerVaultDetailResponse>(
		binding,
		httpUrl(binding, `/v3/evk/vaults/${String(chainId)}/${normalizedVaultAddress}`)
	)
	if (response.data == null)
		throw new Error(`${Source.Euler_Rest}: vault response missing data`)

	return assertDetailWire(response.data, {
		chainId,
		vaultAddress: normalizedVaultAddress,
	})
}

/** Fetch the EVC account-vault positions indexed for one supported chain. */
export const getAccountPositions = async ({
	chainId,
	account,
	limit = eulerVaultListDefaultLimit,
	offset = 0,
}: {
	chainId: number
	account: string
	limit?: number
	offset?: number
}) => {
	assertChainId(chainId)
	const normalizedAccount = assertAddress(account, 'account')
	assertLimit(limit)
	assertOffset(offset)

	const response = await sourceGetJson<EulerAccountPositionsResponse>(
		binding,
		httpUrl(binding, `/v3/accounts/${normalizedAccount}/positions`, {
			chainId,
			limit,
			offset,
		})
	)
	if (response.data == null)
		throw new Error(`${Source.Euler_Rest}: account positions response missing data`)

	return response.data.map((wire) => assertAccountPositionWire(wire, {
		chainId,
		account: normalizedAccount,
	}))
}
