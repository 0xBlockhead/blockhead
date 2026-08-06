import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import {
	tronScanAccountTokensWire,
	tronScanAccountWire,
	tronScanBlocksWire,
	tronScanContractDetailWire,
	tronScanTokenOverviewWire,
	tronScanTransactionDetailWire,
	tronScanTransactionsWire,
	tronScanTrc10TokensWire,
	tronScanTrc20TransfersWire,
	type TronScanAccount,
	type TronScanAccountTokens,
	type TronScanBlocks,
	type TronScanContractDetail,
	type TronScanTokenOverview,
	type TronScanTransactionDetail,
	type TronScanTransactions,
	type TronScanTrc10Tokens,
	type TronScanTrc20Transfers,
} from '$/sources/TronScan/Rest/types.ts'
import bindings from '$/sources/TronScan/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.TronScan_Rest][0]

const tronScanUrl = (path: string) => new URL(path, firstHttpUrlForBinding(binding))

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`TronScan_Rest: invalid ${label} response envelope`)
	}
}

export const getBlock = async (
	height: bigint
) => {
	const url = tronScanUrl('/api/block')
	url.searchParams.set('number', height.toString())
	url.searchParams.set('limit', '1')
	return assertEnvelope(
		'blocks',
		tronScanBlocksWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanBlocks
}

export const getAccount = async (
	address: string
) => {
	const url = tronScanUrl('/api/accountv2')
	url.searchParams.set('address', address)
	return assertEnvelope(
		'account',
		tronScanAccountWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanAccount
}

export const getAccountTokens = async (
	address: string,
	limit: number
) => {
	const url = tronScanUrl('/api/account/tokens')
	url.searchParams.set('address', address)
	url.searchParams.set('start', '0')
	url.searchParams.set('limit', limit.toString())
	url.searchParams.set('hidden', '1')
	url.searchParams.set('show', '3')
	return assertEnvelope(
		'account tokens',
		tronScanAccountTokensWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanAccountTokens
}

export const getTransaction = async (
	transactionId: string
) => {
	const url = tronScanUrl('/api/transaction-info')
	url.searchParams.set('hash', transactionId)
	return assertEnvelope(
		'transaction',
		tronScanTransactionDetailWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanTransactionDetail
}

export const getAccountTransactions = async (
	address: string,
	limit: number,
	start = 0
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 50)
		throw new Error('TronScan_Rest: transaction list limit must be an integer from 1 through 50')
	if (!Number.isSafeInteger(start) || start < 0 || start + limit > 10_000)
		throw new Error('TronScan_Rest: transaction list range must be within the first 10000 rows')

	const url = tronScanUrl('/api/transaction')
	url.searchParams.set('sort', '-timestamp')
	url.searchParams.set('count', 'true')
	url.searchParams.set('limit', limit.toString())
	url.searchParams.set('start', start.toString())
	url.searchParams.set('address', address)

	return assertEnvelope(
		'account transactions',
		tronScanTransactionsWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanTransactions
}

export const getContract = async (
	address: string
) => {
	const url = tronScanUrl('/api/contract')
	url.searchParams.set('contract', address)
	return assertEnvelope(
		'contract',
		tronScanContractDetailWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanContractDetail
}

export const getTokenOverview = async (
	tokenId: string
) => {
	const url = tronScanUrl('/api/tokens/overview')
	url.searchParams.set('start', '0')
	url.searchParams.set('limit', '1')
	url.searchParams.set('verifier', 'all')
	url.searchParams.set('showAll', '1')
	url.searchParams.set('field', '')
	url.searchParams.set('token', tokenId)
	return assertEnvelope(
		'token overview',
		tronScanTokenOverviewWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanTokenOverview
}

export const getTrc10Token = async (
	tokenId: string
) => {
	const url = tronScanUrl('/api/token')
	url.searchParams.set('id', tokenId)
	url.searchParams.set('showAll', '1')
	url.searchParams.set('limit', '1')
	return assertEnvelope(
		'trc10 token',
		tronScanTrc10TokensWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanTrc10Tokens
}

export const getTrc20Transfers = async (
	transactionId: string,
	limit: number
) => {
	const url = tronScanUrl('/api/token_trc20/transfers')
	url.searchParams.set('hash', transactionId)
	url.searchParams.set('limit', limit.toString())
	url.searchParams.set('start', '0')
	return assertEnvelope(
		'trc20 transfers',
		tronScanTrc20TransfersWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanTrc20Transfers
}
