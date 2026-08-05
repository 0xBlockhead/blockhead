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

	return {
		chainId: wire.chainId,
		vaultAddress,
		name: wire.name,
		symbol: wire.symbol,
		decimals: wire.decimals,
		assetAddress: assertVaultAddress(wire.asset.address),
		assetSymbol: wire.asset.symbol,
		totalAssets: assertNonNegativeDecimalString(wire.totalAssets, 'totalAssets'),
		totalBorrows: assertNonNegativeDecimalString(wire.totalBorrows, 'totalBorrows'),
		totalSupplyUsd: assertFiniteNumber(wire.totalSupplyUsd, 'totalSupplyUsd'),
		totalBorrowsUsd: assertFiniteNumber(wire.totalBorrowsUsd, 'totalBorrowsUsd'),
		utilization: assertFiniteNumber(wire.utilization, 'utilization'),
		supplyApy: assertFiniteNumber(wire.supplyApy, 'supplyApy'),
		borrowApy: assertFiniteNumber(wire.borrowApy, 'borrowApy'),
		createdAt: wire.createdAt,
	}
}

const assertDetailWire = (
	wire: EulerVaultDetailWire,
	expected: {
		chainId: number
		vaultAddress: `0x${string}`
	}
): EulerEvkVaultDetail => ({
	...assertSummaryWire(wire, expected),
	...(assertOptionalAddress(wire.dToken, 'dToken') != null && {
		dTokenAddress: assertOptionalAddress(wire.dToken, 'dToken'),
	}),
	...(wire.oracle != null && {
		oracleAddress: assertAddress(wire.oracle.oracle, 'oracle'),
	}),
	...(assertOptionalAddress(wire.governor, 'governor') != null && {
		governorAddress: assertOptionalAddress(wire.governor, 'governor'),
	}),
	...(wire.supplyCap != null && {
		supplyCap: assertNonNegativeDecimalString(wire.supplyCap, 'supplyCap'),
	}),
	...(wire.borrowCap != null && {
		borrowCap: assertNonNegativeDecimalString(wire.borrowCap, 'borrowCap'),
	}),
	...(wire.fees != null && {
		interestFee: assertFiniteNumber(wire.fees.interestFee, 'interestFee'),
	}),
})

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
