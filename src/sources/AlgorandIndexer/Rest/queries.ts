import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import bindings from '$/sources/Nodely/bindings.ts'
import type {
	AlgorandIndexerAccountResponse,
	AlgorandIndexerAssetHoldingsPage,
	AlgorandIndexerTransaction,
	AlgorandIndexerTransactionsPage,
} from '$/sources/AlgorandIndexer/Rest/types.ts'

const binding = Object.fromEntries(
	bindings[Source.Nodely].map((sourceBinding) => [
		sourceBinding.apiFamily,
		sourceBinding,
	])
)[ApiFamily.AlgorandIndexerRestApi]

const assertAddress = (
	address: string,
	label: string
) => {
	if (!/^[A-Z2-7]{57}[AEIMQUY4]$/.test(address))
		throw new Error(`AlgorandIndexer_Rest: invalid ${label}`)
}

const assertSafeUnsigned = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`AlgorandIndexer_Rest: ${label} exceeds lossless JSON integer range`)
}

const touchesAccount = (
	transaction: AlgorandIndexerTransaction,
	address: string
): boolean => (
	transaction.sender === address
	|| transaction['payment-transaction']?.receiver === address
	|| transaction['payment-transaction']?.['close-remainder-to'] === address
	|| transaction['asset-transfer-transaction']?.receiver === address
	|| transaction['asset-transfer-transaction']?.sender === address
	|| transaction['asset-transfer-transaction']?.['close-to'] === address
	|| transaction['application-transaction']?.accounts?.includes(address) === true
	|| transaction['heartbeat-transaction']?.['hb-address'] === address
	|| transaction['inner-txns']?.some((innerTransaction) => (
		touchesAccount(innerTransaction, address)
	)) === true
)

const query = <_Json>(
	path: string
) => (
	getJson<_Json>(binding, path)
)

const pageParameters = (
	limit: number,
	next?: string
) => {
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 1_000)
		throw new Error('AlgorandIndexer_Rest: page limit must be an integer from 0 through 1000')
	if (next === '')
		throw new Error('AlgorandIndexer_Rest: continuation token must not be empty')
	const parameters = new URLSearchParams({
		limit: limit.toString(),
	})
	if (next != null)
		parameters.set('next', next)
	return parameters
}

export const getAccountAssets = async (
	{
		address,
		limit,
		next,
	}: {
		address: string
		limit: number
		next?: string
	}
) => {
	assertAddress(address, 'account address')
	const parameters = pageParameters(limit, next)
	parameters.set('include-all', 'true')
	if (limit === 0)
		return {
			assets: [],
			'current-round': 0,
		}
	const page = await query<AlgorandIndexerAssetHoldingsPage>(
		`/v2/accounts/${encodeURIComponent(address)}/assets?${parameters.toString()}`
	)
	assertSafeUnsigned(page['current-round'], 'asset page round')
	if (page.assets.length > limit)
		throw new Error('AlgorandIndexer_Rest: asset page exceeds requested limit')

	const assetIds = new Set<number>()
	for (const asset of page.assets) {
		assertSafeUnsigned(asset['asset-id'], 'asset ID')
		assertSafeUnsigned(asset.amount, 'asset amount')
		if (assetIds.has(asset['asset-id']))
			throw new Error('AlgorandIndexer_Rest: duplicate account asset')
		assetIds.add(asset['asset-id'])
	}
	if (page['next-token'] === '')
		throw new Error('AlgorandIndexer_Rest: continuation token must not be empty')
	if (page['next-token'] != null && page['next-token'] === next)
		throw new Error('AlgorandIndexer_Rest: asset continuation did not advance')
	return page
}

export const getAccount = async (
	address: string
) => {
	assertAddress(address, 'account address')
	const response = await query<AlgorandIndexerAccountResponse>(
		`/v2/accounts/${encodeURIComponent(address)}`
	)
	if (response.account.address !== address)
		throw new Error('AlgorandIndexer_Rest: account response does not match the subject')
	assertSafeUnsigned(response['current-round'], 'account observation round')
	assertSafeUnsigned(response.account.amount, 'account amount')
	if (response.account['pending-rewards'] != null)
		assertSafeUnsigned(response.account['pending-rewards'], 'account pending rewards')
	if (response.account['reward-base'] != null)
		assertSafeUnsigned(response.account['reward-base'], 'account reward base')
	return response
}

export const getAccountTransactions = async (
	{
		address,
		limit,
		next,
	}: {
		address: string
		limit: number
		next?: string
	}
) => {
	assertAddress(address, 'account address')
	const parameters = pageParameters(limit, next)
	if (limit === 0)
		return {
			'current-round': 0,
			transactions: [],
		}
	const page = await query<AlgorandIndexerTransactionsPage>(
		`/v2/accounts/${encodeURIComponent(address)}/transactions?${parameters.toString()}`
	)
	assertSafeUnsigned(page['current-round'], 'transaction page round')
	if (page.transactions.length > limit)
		throw new Error('AlgorandIndexer_Rest: transaction page exceeds requested limit')

	const transactionIds = new Set<string>()
	for (const transaction of page.transactions) {
		if (!touchesAccount(transaction, address))
			throw new Error('AlgorandIndexer_Rest: transaction page contains a foreign account row')
		if (transaction.id.length === 0 || transactionIds.has(transaction.id))
			throw new Error('AlgorandIndexer_Rest: invalid or duplicate transaction ID')
		transactionIds.add(transaction.id)
		assertAddress(transaction.sender, 'transaction sender')
		assertSafeUnsigned(transaction.fee, 'transaction fee')
		if (transaction['confirmed-round'] != null)
			assertSafeUnsigned(transaction['confirmed-round'], 'confirmed round')
		if (transaction['payment-transaction'] != null) {
			assertAddress(transaction['payment-transaction'].receiver, 'payment receiver')
			assertSafeUnsigned(transaction['payment-transaction'].amount, 'payment amount')
		}
		if (transaction['asset-transfer-transaction'] != null) {
			assertAddress(transaction['asset-transfer-transaction'].receiver, 'asset receiver')
			assertSafeUnsigned(transaction['asset-transfer-transaction'].amount, 'asset transfer amount')
			assertSafeUnsigned(transaction['asset-transfer-transaction']['asset-id'], 'asset transfer ID')
		}
	}
	if (page['next-token'] === '')
		throw new Error('AlgorandIndexer_Rest: continuation token must not be empty')
	if (page['next-token'] != null && page['next-token'] === next)
		throw new Error('AlgorandIndexer_Rest: transaction continuation did not advance')
	return page
}
