/**
 * Morpho Blue REST named operations (public api.morpho.org).
 * @see https://docs.morpho.org/developers/api/morpho/
 * @see https://docs.morpho.org/build/borrow/tutorials/get-data/
 */
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/Morpho/bindings.ts'
import {
	morphoBlueByChainId,
	morphoMarketIdPattern,
} from '$/sources/Morpho/Rest/constants.ts'
import type {
	MorphoBlueMarketConfig,
	MorphoBlueMarketConfigResponse,
	MorphoBlueMarketConfigWire,
	MorphoBlueMarketState,
	MorphoBlueMarketStateResponse,
	MorphoBlueMarketStateWire,
} from '$/sources/Morpho/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const binding = bindings[Source.Morpho_Rest][0]

const assertChainId = (chainId: number) => {
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Morpho_Rest}: invalid chain id ${String(chainId)}`)
	if (morphoBlueByChainId[chainId] == null)
		throw new Error(`${Source.Morpho_Rest}: unsupported chain id ${String(chainId)}`)
}

const assertMarketId = (marketId: string | undefined) => {
	if (marketId == null || !morphoMarketIdPattern.test(marketId))
		throw new Error(`${Source.Morpho_Rest}: invalid market id ${marketId}`)
	const normalized = hexLowerOfByteSize(marketId, 32)
	if (normalized == null)
		throw new Error(`${Source.Morpho_Rest}: invalid market id ${marketId}`)
	return normalized
}

const assertAddress = (
	value: string | undefined,
	label: string
) => {
	if (value == null)
		throw new Error(`${Source.Morpho_Rest}: market missing ${label}`)
	const normalized = hexLowerOfByteSize(value, 20)
	if (normalized == null)
		throw new Error(`${Source.Morpho_Rest}: invalid ${label} ${value}`)
	return normalized
}

const assertNonEmptyDecimalString = (
	value: string | undefined,
	label: string
) => {
	if (value == null || value.length < 1)
		throw new Error(`${Source.Morpho_Rest}: market missing ${label}`)
	return value
}

const marketSelectorPath = (
	chainId: number,
	marketId: `0x${string}`
) => (
	`/v0/blue/markets/${String(chainId)}:${marketId}`
)

const assertMarketConfigWire = (
	wire: MorphoBlueMarketConfigWire,
	expected: {
		chainId: number
		marketId: `0x${string}`
	}
): MorphoBlueMarketConfig => {
	if (wire.chain_id !== expected.chainId)
		throw new Error(`${Source.Morpho_Rest}: market chain mismatch`)
	const marketId = assertMarketId(wire.market_id)
	if (marketId !== expected.marketId)
		throw new Error(`${Source.Morpho_Rest}: market id mismatch`)

	return {
		chainId: wire.chain_id,
		marketId,
		loanToken: assertAddress(wire.loan_token, 'loan token'),
		collateralToken: assertAddress(wire.collateral_token, 'collateral token'),
		oracleAddress: assertAddress(wire.oracle_address, 'oracle address'),
		irmAddress: assertAddress(wire.irm_address, 'irm address'),
		lltvWad: assertNonEmptyDecimalString(wire.lltv_wad, 'lltv_wad'),
		creationBlockNumber: assertNonEmptyDecimalString(wire.creation_block_number, 'creation_block_number'),
	}
}

const assertMarketStateWire = (
	wire: MorphoBlueMarketStateWire,
	expected: {
		chainId: number
		marketId: `0x${string}`
	}
): MorphoBlueMarketState => {
	if (wire.chain_id !== expected.chainId)
		throw new Error(`${Source.Morpho_Rest}: market state chain mismatch`)
	const marketId = assertMarketId(wire.market_id)
	if (marketId !== expected.marketId)
		throw new Error(`${Source.Morpho_Rest}: market state id mismatch`)
	if (
		wire.last_accrual_timestamp == null
		|| !Number.isSafeInteger(wire.last_accrual_timestamp)
		|| wire.last_accrual_timestamp < 0
	)
		throw new Error(`${Source.Morpho_Rest}: invalid last_accrual_timestamp`)

	return {
		chainId: wire.chain_id,
		marketId,
		lastIndexedBlock: assertNonEmptyDecimalString(wire.last_indexed_block, 'last_indexed_block'),
		lastAccrualTimestamp: wire.last_accrual_timestamp,
		totalSupplyAssets: assertNonEmptyDecimalString(wire.total_supply_assets, 'total_supply_assets'),
		totalSupplyShares: assertNonEmptyDecimalString(wire.total_supply_shares, 'total_supply_shares'),
		totalBorrowAssets: assertNonEmptyDecimalString(wire.total_borrow_assets, 'total_borrow_assets'),
		totalBorrowShares: assertNonEmptyDecimalString(wire.total_borrow_shares, 'total_borrow_shares'),
		feeWad: assertNonEmptyDecimalString(wire.fee_wad, 'fee_wad'),
	}
}

/** Immutable Morpho Blue market config by `chainId:marketId`. */
export const getMarket = async ({
	chainId,
	marketId,
}: {
	chainId: number
	marketId: string
}) => {
	assertChainId(chainId)
	const normalizedMarketId = assertMarketId(marketId)
	const response = await sourceGetJson<MorphoBlueMarketConfigResponse>(
		binding,
		httpUrl(binding, marketSelectorPath(chainId, normalizedMarketId))
	)
	if (response.data == null)
		throw new Error(`${Source.Morpho_Rest}: market response missing data`)

	return assertMarketConfigWire(response.data, {
		chainId,
		marketId: normalizedMarketId,
	})
}

/** Live Morpho Blue market state by `chainId:marketId`. */
export const getMarketState = async ({
	chainId,
	marketId,
}: {
	chainId: number
	marketId: string
}) => {
	assertChainId(chainId)
	const normalizedMarketId = assertMarketId(marketId)
	const response = await sourceGetJson<MorphoBlueMarketStateResponse>(
		binding,
		httpUrl(binding, `${marketSelectorPath(chainId, normalizedMarketId)}/state`)
	)
	if (response.data == null)
		throw new Error(`${Source.Morpho_Rest}: market state response missing data`)

	return assertMarketStateWire(response.data, {
		chainId,
		marketId: normalizedMarketId,
	})
}
