import { TransportType } from '$/constants/TransportType.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Cardanoscan/bindings.ts'
import {
	assertCardanoscanEnvelope,
	cardanoscanAddressBalanceWire,
	cardanoscanBlockWire,
	cardanoscanNetworkProtocolWire,
	cardanoscanNetworkStateWire,
	cardanoscanPaginatedPoolsWire,
	cardanoscanPoolStatsWire,
	cardanoscanPoolWire,
	cardanoscanStakeKeyWire,
	cardanoscanTokenWire,
	cardanoscanTransactionWire,
	type CardanoscanAddressBalance,
	type CardanoscanBlock,
	type CardanoscanNetworkProtocol,
	type CardanoscanNetworkState,
	type CardanoscanPaginatedPools,
	type CardanoscanPool,
	type CardanoscanPoolStats,
	type CardanoscanStakeKey,
	type CardanoscanToken,
	type CardanoscanTransaction,
} from '$/sources/Cardanoscan/Rest/envelopes.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.Cardanoscan_Rest][0]

export const restEndpoints = [{
	url: firstHttpUrlForBinding(binding),
	transportType: TransportType.Http,
	providerName: 'Cardanoscan',
}]

const query = (
	path: string,
	params?: Record<string, string | number | boolean | undefined>
) => (
	sourceGetJson<JsonValue>(
		binding,
		httpUrl(binding, path, params)
	)
)

export const getLatestBlock = async (): Promise<CardanoscanBlock> => (
	assertCardanoscanEnvelope(
		cardanoscanBlockWire,
		await query('/api/v1/block/latest'),
		'block'
	)
)

export const getBlock = async (
	params:
		| { blockHash: string }
		| { blockHeight: number }
		| { absoluteSlot: number }
		| { epoch: number, slot: number }
): Promise<CardanoscanBlock> => {
	if (
		('blockHash' in params && !/^[0-9a-fA-F]{64}$/.test(params.blockHash))
		|| ('blockHeight' in params && (!Number.isSafeInteger(params.blockHeight) || params.blockHeight < 0))
		|| ('absoluteSlot' in params && (!Number.isSafeInteger(params.absoluteSlot) || params.absoluteSlot < 0))
		|| ('epoch' in params && (!Number.isSafeInteger(params.epoch) || params.epoch < 0 || !Number.isSafeInteger(params.slot) || params.slot < 0))
	)
		throw new Error('Cardanoscan_Rest: invalid block selector')

	const block = assertCardanoscanEnvelope(
		cardanoscanBlockWire,
		await query('/api/v1/block', params),
		'block'
	)
	if (
		('blockHash' in params && block.hash.toLowerCase() !== params.blockHash.toLowerCase())
		|| ('blockHeight' in params && block.blockHeight !== params.blockHeight)
		|| ('absoluteSlot' in params && block.absSlot !== params.absoluteSlot)
		|| ('epoch' in params && (block.epoch !== params.epoch || block.slot !== params.slot))
	)
		throw new Error('Cardanoscan_Rest: block response has mismatched identity')

	return block
}

export const getTransaction = async (
	hash: string
): Promise<CardanoscanTransaction> => {
	if (!/^[0-9a-fA-F]{64}$/.test(hash))
		throw new Error('Cardanoscan_Rest: invalid transaction hash')

	const transaction = assertCardanoscanEnvelope(
		cardanoscanTransactionWire,
		await query('/api/v1/transaction', {
			hash,
		}),
		'transaction'
	)
	if (transaction.hash.toLowerCase() !== hash.toLowerCase())
		throw new Error('Cardanoscan_Rest: transaction response has mismatched identity')

	return transaction
}

export const getAsset = async (
	params:
		| { assetId: string }
		| { fingerprint: string }
): Promise<CardanoscanToken> => (
	assertCardanoscanEnvelope(
		cardanoscanTokenWire,
		await query('/api/v1/asset', params),
		'asset'
	)
)

export const getAddressBalance = async (
	address: string
): Promise<CardanoscanAddressBalance> => (
	assertCardanoscanEnvelope(
		cardanoscanAddressBalanceWire,
		await query('/api/v1/address/balance', {
			address,
		}),
		'address balance'
	)
)

export const getPool = async (
	poolId: string
): Promise<CardanoscanPool> => (
	assertCardanoscanEnvelope(
		cardanoscanPoolWire,
		await query('/api/v1/pool', {
			poolId,
		}),
		'pool'
	)
)

export const getPoolStats = async (
	poolId: string
): Promise<CardanoscanPoolStats> => (
	assertCardanoscanEnvelope(
		cardanoscanPoolStatsWire,
		await query('/api/v1/pool/stats', {
			poolId,
		}),
		'pool stats'
	)
)

export const listPools = async (
	pageNo: number,
	limit: number
): Promise<CardanoscanPaginatedPools> => {
	if (!Number.isSafeInteger(pageNo) || pageNo < 1)
		throw new Error('Cardanoscan_Rest: pool list pageNo must be a positive integer')
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 100)
		throw new Error('Cardanoscan_Rest: pool list limit must be an integer from 0 through 100')

	if (limit === 0)
		return {
			pageNo,
			limit: 0,
			count: 0,
			pools: [],
		}

	const page = assertCardanoscanEnvelope(
		cardanoscanPaginatedPoolsWire,
		await query('/api/v1/pool/list', {
			pageNo,
			limit,
		}),
		'pool list'
	)
	if (new Set(page.pools.map((pool) => pool.poolId)).size !== page.pools.length)
		throw new Error('Cardanoscan_Rest: pool list contains duplicate identities')

	return page
}

export const getRewardAccount = async (
	rewardAddress: string
): Promise<CardanoscanStakeKey> => (
	assertCardanoscanEnvelope(
		cardanoscanStakeKeyWire,
		await query('/api/v1/rewardAccount', {
			rewardAddress,
		}),
		'reward account'
	)
)

export const getNetworkState = async (): Promise<CardanoscanNetworkState> => (
	assertCardanoscanEnvelope(
		cardanoscanNetworkStateWire,
		await query('/api/v1/network/state'),
		'network state'
	)
)

export const getNetworkProtocolParams = async (): Promise<CardanoscanNetworkProtocol> => (
	assertCardanoscanEnvelope(
		cardanoscanNetworkProtocolWire,
		await query('/api/v1/network/protocolParams'),
		'network protocol params'
	)
)
