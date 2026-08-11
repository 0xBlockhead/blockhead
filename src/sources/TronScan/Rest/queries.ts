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

const assertAtMost = (
	label: string,
	values: unknown[],
	limit: number
) => {
	if (values.length > limit)
		throw new Error(`TronScan_Rest: ${label} response exceeds requested limit`)
}

export const getBlock = async (
	height: bigint
) => {
	if (height < 0n)
		throw new Error('TronScan_Rest: block height must be non-negative')
	const url = tronScanUrl('/api/block')
	url.searchParams.set('number', height.toString())
	url.searchParams.set('limit', '1')
	const blocks = assertEnvelope(
		'blocks',
		tronScanBlocksWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanBlocks
	assertAtMost('blocks', blocks.data, 1)
	if (blocks.data.length === 1 && BigInt(blocks.data[0].number) !== height)
		throw new Error('TronScan_Rest: block response height mismatch')

	return blocks
}

export const getAccount = async (
	address: string
) => {
	const url = tronScanUrl('/api/accountv2')
	url.searchParams.set('address', address)
	const account = assertEnvelope(
		'account',
		tronScanAccountWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanAccount
	if (account.address != null && account.address !== address)
		throw new Error('TronScan_Rest: account response identity mismatch')

	return account
}

export const getAccountTokens = async (
	address: string,
	limit: number
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 200)
		throw new Error('TronScan_Rest: account token limit must be an integer from 1 through 200')
	const url = tronScanUrl('/api/account/tokens')
	url.searchParams.set('address', address)
	url.searchParams.set('start', '0')
	url.searchParams.set('limit', limit.toString())
	url.searchParams.set('hidden', '1')
	url.searchParams.set('show', '3')
	const accountTokens = assertEnvelope(
		'account tokens',
		tronScanAccountTokensWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanAccountTokens
	assertAtMost('account tokens', accountTokens.data, limit)

	return accountTokens
}

export const getTransaction = async (
	transactionId: string
) => {
	const url = tronScanUrl('/api/transaction-info')
	url.searchParams.set('hash', transactionId)
	const transaction = assertEnvelope(
		'transaction',
		tronScanTransactionDetailWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanTransactionDetail
	if (
		(transaction.hash != null && transaction.hash !== transactionId)
		|| (transaction.transactionHash != null && transaction.transactionHash !== transactionId)
	)
		throw new Error('TronScan_Rest: transaction response identity mismatch')

	return transaction
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

	const transactions = assertEnvelope(
		'account transactions',
		tronScanTransactionsWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanTransactions
	assertAtMost('account transactions', transactions.data, limit)
	const hashes = new Set<string>()
	for (const transaction of transactions.data) {
		if (transaction.ownerAddress != null && transaction.ownerAddress !== address)
			throw new Error('TronScan_Rest: account transaction page contains a foreign owner')
		if (hashes.has(transaction.hash))
			throw new Error('TronScan_Rest: account transaction page contains a duplicate hash')
		hashes.add(transaction.hash)
	}

	return transactions
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
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 50)
		throw new Error('TronScan_Rest: trc20 transfer limit must be an integer from 1 through 50')
	const url = tronScanUrl('/api/token_trc20/transfers')
	url.searchParams.set('hash', transactionId)
	url.searchParams.set('limit', limit.toString())
	url.searchParams.set('start', '0')
	const transfers = assertEnvelope(
		'trc20 transfers',
		tronScanTrc20TransfersWire,
		await sourceGetJson(binding, url.toString())
	) as TronScanTrc20Transfers
	const rows = transfers.token_transfers ?? transfers.data ?? []
	assertAtMost('trc20 transfers', rows, limit)
	const identities = new Set<string>()
	for (const transfer of rows) {
		const identity = transfer.transaction_id ?? transfer.transactionHash
		if (identity != null && identity !== transactionId)
			throw new Error('TronScan_Rest: trc20 transfer response contains a foreign transaction')
		if (identity != null && identities.has(identity))
			throw new Error('TronScan_Rest: trc20 transfer response contains a duplicate transaction')
		if (identity != null)
			identities.add(identity)
	}

	return transfers
}
