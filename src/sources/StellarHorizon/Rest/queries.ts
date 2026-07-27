import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/StellarHorizon/bindings.ts'
import type {
	StellarHorizonAccount,
	StellarHorizonBalance,
	StellarHorizonOperation,
	StellarHorizonPage,
	StellarHorizonPayment,
	StellarHorizonTransaction,
} from '$/sources/StellarHorizon/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.StellarHorizon_Rest]

const assertAccountId = (
	accountId: string,
	label = 'account ID'
) => {
	if (!/^G[A-Z2-7]{55}$/.test(accountId))
		throw new Error(`StellarHorizon_Rest: invalid ${label}`)
}

const assertUnsignedInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`StellarHorizon_Rest: invalid ${label}`)
}

const assertUnsignedIntegerString = (
	value: string,
	label: string
) => {
	try {
		if (BigInt(value) < 0n)
			throw new Error()
	} catch {
		throw new Error(`StellarHorizon_Rest: invalid ${label}`)
	}
}

const assertAmount = (
	value: string,
	label: string
) => {
	if (!/^(0|[1-9][0-9]*)\.[0-9]{7}$/.test(value))
		throw new Error(`StellarHorizon_Rest: invalid ${label}`)
}

const assertBalance = (balance: StellarHorizonBalance) => {
	assertAmount(balance.balance, 'balance')
	if (balance.buying_liabilities != null)
		assertAmount(balance.buying_liabilities, 'buying liabilities')
	if (balance.selling_liabilities != null)
		assertAmount(balance.selling_liabilities, 'selling liabilities')
	if (balance.limit != null)
		assertAmount(balance.limit, 'trustline limit')
	if (balance.last_modified_ledger != null)
		assertUnsignedInteger(balance.last_modified_ledger, 'balance ledger')

	if (balance.asset_type === 'native') {
		if (
			balance.asset_code != null
			|| balance.asset_issuer != null
			|| balance.liquidity_pool_id != null
		)
			throw new Error('StellarHorizon_Rest: native balance has foreign asset identity')
		return
	}
	if (balance.asset_type === 'liquidity_pool_shares') {
		if (balance.liquidity_pool_id == null || !/^[0-9a-f]{64}$/.test(balance.liquidity_pool_id))
			throw new Error('StellarHorizon_Rest: invalid liquidity-pool balance identity')
		return
	}
	if (balance.asset_code == null || balance.asset_code.length === 0 || balance.asset_issuer == null)
		throw new Error('StellarHorizon_Rest: issued balance is missing asset identity')
	assertAccountId(balance.asset_issuer, 'asset issuer')
}

const accountPath = (accountId: string) => (
	`/accounts/${encodeURIComponent(accountId)}`
)

const pageParameters = (
	limit: number,
	cursor?: string
) => {
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 200)
		throw new Error('StellarHorizon_Rest: page limit must be an integer from 0 through 200')
	if (cursor === '')
		throw new Error('StellarHorizon_Rest: cursor must not be empty')
	const parameters = new URLSearchParams({
		limit: String(limit),
		order: 'desc',
	})
	if (cursor != null)
		parameters.set('cursor', cursor)
	return parameters
}

const assertPage = <_Record extends {
	id: string
	paging_token: string
}>(
	page: StellarHorizonPage<_Record>,
	limit: number,
	cursor?: string
) => {
	if (page._embedded.records.length > limit)
		throw new Error('StellarHorizon_Rest: page exceeds requested limit')
	const ids = new Set<string>()
	for (const record of page._embedded.records) {
		if (record.id.length === 0 || ids.has(record.id))
			throw new Error('StellarHorizon_Rest: invalid or duplicate record ID')
		if (record.paging_token.length === 0)
			throw new Error('StellarHorizon_Rest: invalid paging token')
		ids.add(record.id)
	}
	if (
		page._embedded.records.length > 0
		&& page._embedded.records.at(-1)?.paging_token === cursor
	)
		throw new Error('StellarHorizon_Rest: cursor did not advance')
}

const touchesAccount = (
	operation: StellarHorizonOperation,
	accountId: string
) => (
	operation.source_account === accountId
	|| operation.from === accountId
	|| operation.to === accountId
	|| operation.account === accountId
	|| operation.into === accountId
	|| operation.trustor === accountId
	|| operation.trustee === accountId
	|| operation.funder === accountId
)

export const query = <_Json>(
	path: string
) => (
	getJson<_Json>(binding, path)
)

export const getAccount = async (
	accountId: string
) => {
	assertAccountId(accountId)
	const account = await query<StellarHorizonAccount>(accountPath(accountId))
	if (account.id !== accountId || account.account_id !== accountId)
		throw new Error('StellarHorizon_Rest: account response identity mismatch')
	assertUnsignedIntegerString(account.sequence, 'account sequence')
	assertUnsignedInteger(account.subentry_count, 'subentry count')
	assertUnsignedInteger(account.last_modified_ledger, 'last modified ledger')
	const assetIdentities = new Set<string>()
	for (const balance of account.balances) {
		assertBalance(balance)
		const assetIdentity = (
			balance.asset_type === 'native' ?
				'native'
				: balance.asset_type === 'liquidity_pool_shares' ?
					`pool:${balance.liquidity_pool_id}`
					:
					`${balance.asset_code}:${balance.asset_issuer}`
		)
		if (assetIdentities.has(assetIdentity))
			throw new Error('StellarHorizon_Rest: duplicate account balance identity')
		assetIdentities.add(assetIdentity)
	}
	return account
}

const getAccountPage = async <_Record extends {
	id: string
	paging_token: string
}>(
	accountId: string,
	resource: 'operations' | 'payments' | 'transactions',
	limit: number,
	cursor?: string
) => {
	assertAccountId(accountId)
	const parameters = pageParameters(limit, cursor)
	if (limit === 0)
		return {
			_links: {
				next: {
					href: '',
				},
			},
			_embedded: {
				records: [],
			},
		} satisfies StellarHorizonPage<_Record>
	const page = await query<StellarHorizonPage<_Record>>(
		`${accountPath(accountId)}/${resource}?${parameters.toString()}`
	)
	assertPage(page, limit, cursor)
	return page
}

export const getAccountPayments = async (
	accountId: string,
	limit: number,
	cursor?: string
) => {
	const page = await getAccountPage<StellarHorizonPayment>(
		accountId,
		'payments',
		limit,
		cursor
	)
	for (const payment of page._embedded.records) {
		if (!touchesAccount(payment, accountId))
			throw new Error('StellarHorizon_Rest: payment page contains a foreign account row')
		if (payment.amount != null)
			assertAmount(payment.amount, 'payment amount')
		if (payment.asset_issuer != null)
			assertAccountId(payment.asset_issuer, 'payment asset issuer')
	}
	return page
}

export const getAccountOperations = async (
	accountId: string,
	limit: number,
	cursor?: string
) => {
	const page = await getAccountPage<StellarHorizonOperation>(
		accountId,
		'operations',
		limit,
		cursor
	)
	for (const operation of page._embedded.records) {
		if (!touchesAccount(operation, accountId))
			throw new Error('StellarHorizon_Rest: operation page contains a foreign account row')
		if (operation.transaction_hash.length === 0)
			throw new Error('StellarHorizon_Rest: operation is missing transaction identity')
		assertUnsignedInteger(operation.type_i, 'operation type index')
	}
	return page
}

export const getAccountTransactions = async (
	accountId: string,
	limit: number,
	cursor?: string
) => {
	const page = await getAccountPage<StellarHorizonTransaction>(
		accountId,
		'transactions',
		limit,
		cursor
	)
	for (const transaction of page._embedded.records) {
		if (!/^[0-9a-f]{64}$/.test(transaction.hash))
			throw new Error('StellarHorizon_Rest: invalid transaction hash')
		assertAccountId(transaction.source_account, 'transaction source account')
		assertAccountId(transaction.fee_account, 'transaction fee account')
		assertUnsignedIntegerString(transaction.source_account_sequence, 'transaction source sequence')
		assertUnsignedIntegerString(transaction.fee_charged, 'charged fee')
		assertUnsignedIntegerString(transaction.max_fee, 'maximum fee')
		assertUnsignedInteger(transaction.ledger, 'transaction ledger')
		assertUnsignedInteger(transaction.operation_count, 'transaction operation count')
	}
	return page
}
