import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	TronScanAccount,
	TronScanAccountTokens,
	TronScanBlocks,
	TronScanContractDetail,
	TronScanTokenOverview,
	TronScanTransactionDetail,
	TronScanTransactions,
	TronScanTrc10Tokens,
	TronScanTrc20Transfers,
} from '$/sources/TronScan/Rest/types.ts'

const tronScanUrl = (
	binding: SourceBinding,
	path: string
) => new URL(path, firstHttpUrlForBinding(binding))

export const getBlock = (
	binding: SourceBinding,
	height: bigint
) => {
	const url = tronScanUrl(binding, '/api/block')
	url.searchParams.set('number', height.toString())
	url.searchParams.set('limit', '1')
	return sourceGetJson<TronScanBlocks>(binding, url.toString())
}

export const getAccount = (
	binding: SourceBinding,
	address: string
) => {
	const url = tronScanUrl(binding, '/api/accountv2')
	url.searchParams.set('address', address)
	return sourceGetJson<TronScanAccount>(binding, url.toString())
}

export const getAccountTokens = (
	binding: SourceBinding,
	address: string,
	limit: number
) => {
	const url = tronScanUrl(binding, '/api/account/tokens')
	url.searchParams.set('address', address)
	url.searchParams.set('start', '0')
	url.searchParams.set('limit', limit.toString())
	url.searchParams.set('hidden', '1')
	url.searchParams.set('show', '3')
	return sourceGetJson<TronScanAccountTokens>(binding, url.toString())
}

export const getTransaction = (
	binding: SourceBinding,
	transactionId: string
) => {
	const url = tronScanUrl(binding, '/api/transaction-info')
	url.searchParams.set('hash', transactionId)
	return sourceGetJson<TronScanTransactionDetail>(binding, url.toString())
}

export const getAccountTransactions = (
	binding: SourceBinding,
	address: string,
	limit: number,
	start = 0
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 50)
		throw new Error('TronScan_Rest: transaction list limit must be an integer from 1 through 50')
	if (!Number.isSafeInteger(start) || start < 0 || start + limit > 10_000)
		throw new Error('TronScan_Rest: transaction list range must be within the first 10000 rows')

	const url = tronScanUrl(binding, '/api/transaction')
	url.searchParams.set('sort', '-timestamp')
	url.searchParams.set('count', 'true')
	url.searchParams.set('limit', limit.toString())
	url.searchParams.set('start', start.toString())
	url.searchParams.set('address', address)

	return sourceGetJson<TronScanTransactions>(binding, url.toString())
}

export const getContract = (
	binding: SourceBinding,
	address: string
) => {
	const url = tronScanUrl(binding, '/api/contract')
	url.searchParams.set('contract', address)
	return sourceGetJson<TronScanContractDetail>(binding, url.toString())
}

export const getTokenOverview = (
	binding: SourceBinding,
	tokenId: string
) => {
	const url = tronScanUrl(binding, '/api/tokens/overview')
	url.searchParams.set('start', '0')
	url.searchParams.set('limit', '1')
	url.searchParams.set('verifier', 'all')
	url.searchParams.set('showAll', '1')
	url.searchParams.set('field', '')
	url.searchParams.set('token', tokenId)
	return sourceGetJson<TronScanTokenOverview>(binding, url.toString())
}

export const getTrc10Token = (
	binding: SourceBinding,
	tokenId: string
) => {
	const url = tronScanUrl(binding, '/api/token')
	url.searchParams.set('id', tokenId)
	url.searchParams.set('showAll', '1')
	url.searchParams.set('limit', '1')
	return sourceGetJson<TronScanTrc10Tokens>(binding, url.toString())
}

export const getTrc20Transfers = (
	binding: SourceBinding,
	transactionId: string,
	limit: number
) => {
	const url = tronScanUrl(binding, '/api/token_trc20/transfers')
	url.searchParams.set('hash', transactionId)
	url.searchParams.set('limit', limit.toString())
	url.searchParams.set('start', '0')
	return sourceGetJson<TronScanTrc20Transfers>(binding, url.toString())
}
