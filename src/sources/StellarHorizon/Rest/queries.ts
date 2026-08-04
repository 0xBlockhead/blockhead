import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/StellarHorizon/bindings.ts'
import type {
	StellarHorizonAccount,
	StellarHorizonAssetIdentity,
	StellarHorizonBalance,
	StellarHorizonOffer,
	StellarHorizonOperation,
	StellarHorizonPage,
	StellarHorizonPayment,
	StellarHorizonTrade,
	StellarHorizonTransaction,
} from '$/sources/StellarHorizon/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

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

const assertAssetIdentity = (
	asset: StellarHorizonAssetIdentity,
	label: string
) => {
	if (asset.asset_type === 'native') {
		if (asset.asset_code != null || asset.asset_issuer != null)
			throw new Error(`StellarHorizon_Rest: ${label} native asset has foreign identity`)
		return
	}
	if (asset.asset_code == null || asset.asset_code.length === 0 || asset.asset_issuer == null)
		throw new Error(`StellarHorizon_Rest: ${label} issued asset is missing identity`)
	assertAccountId(asset.asset_issuer, `${label} asset issuer`)
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

const query = <_Json>(
	path: string
) => (
	getJson<_Json>(bindings[Source.StellarHorizon_Rest][0], path)
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
	resource: 'operations' | 'payments' | 'transactions' | 'offers' | 'trades',
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
		}
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

export const getAccountOffers = async (
	accountId: string,
	limit: number,
	cursor?: string
) => {
	const page = await getAccountPage<StellarHorizonOffer>(
		accountId,
		'offers',
		limit,
		cursor
	)
	for (const offer of page._embedded.records) {
		if (offer.seller !== accountId)
			throw new Error('StellarHorizon_Rest: offer page contains a foreign seller')
		if (!/^\d+$/.test(offer.id))
			throw new Error('StellarHorizon_Rest: invalid offer ID')
		assertAmount(offer.amount, 'offer amount')
		assertAmount(offer.price, 'offer price')
		assertUnsignedInteger(offer.last_modified_ledger, 'offer ledger')
		assertUnsignedInteger(offer.price_r.n, 'offer price numerator')
		assertUnsignedInteger(offer.price_r.d, 'offer price denominator')
		if (offer.price_r.d === 0)
			throw new Error('StellarHorizon_Rest: offer price denominator must be nonzero')
		assertAssetIdentity(offer.selling, 'selling')
		assertAssetIdentity(offer.buying, 'buying')
		if (offer.sponsor != null)
			assertAccountId(offer.sponsor, 'offer sponsor')
	}
	return page
}

export const getAccountTrades = async (
	accountId: string,
	limit: number,
	cursor?: string
) => {
	const page = await getAccountPage<StellarHorizonTrade>(
		accountId,
		'trades',
		limit,
		cursor
	)
	for (const trade of page._embedded.records) {
		if (
			trade.base_account !== accountId
			&& trade.counter_account !== accountId
		)
			throw new Error('StellarHorizon_Rest: trade page contains a foreign account row')
		if (trade.id.length === 0)
			throw new Error('StellarHorizon_Rest: invalid trade ID')
		assertAmount(trade.base_amount, 'trade base amount')
		assertAmount(trade.counter_amount, 'trade counter amount')
		if (trade.base_account != null)
			assertAccountId(trade.base_account, 'trade base account')
		if (trade.counter_account != null)
			assertAccountId(trade.counter_account, 'trade counter account')
		if (trade.base_asset_issuer != null)
			assertAccountId(trade.base_asset_issuer, 'trade base asset issuer')
		if (trade.counter_asset_issuer != null)
			assertAccountId(trade.counter_asset_issuer, 'trade counter asset issuer')
		if (trade.base_liquidity_pool_id != null && !/^[0-9a-f]{64}$/.test(trade.base_liquidity_pool_id))
			throw new Error('StellarHorizon_Rest: invalid trade base liquidity pool')
		if (trade.counter_liquidity_pool_id != null && !/^[0-9a-f]{64}$/.test(trade.counter_liquidity_pool_id))
			throw new Error('StellarHorizon_Rest: invalid trade counter liquidity pool')
		assertUnsignedIntegerString(String(trade.price.n), 'trade price numerator')
		assertUnsignedIntegerString(String(trade.price.d), 'trade price denominator')
		if (BigInt(trade.price.d) === 0n)
			throw new Error('StellarHorizon_Rest: trade price denominator must be nonzero')
	}
	return page
}

export const getTransaction = async (
	hash: string
) => {
	if (!/^[0-9a-f]{64}$/.test(hash))
		throw new Error('StellarHorizon_Rest: invalid transaction hash')
	const transaction = await query<StellarHorizonTransaction>(
		`/transactions/${encodeURIComponent(hash)}`
	)
	if (transaction.hash !== hash)
		throw new Error('StellarHorizon_Rest: transaction response identity mismatch')
	assertAccountId(transaction.source_account, 'transaction source account')
	assertAccountId(transaction.fee_account, 'transaction fee account')
	assertUnsignedIntegerString(transaction.source_account_sequence, 'transaction source sequence')
	assertUnsignedIntegerString(transaction.fee_charged, 'charged fee')
	assertUnsignedIntegerString(transaction.max_fee, 'maximum fee')
	assertUnsignedInteger(transaction.ledger, 'transaction ledger')
	assertUnsignedInteger(transaction.operation_count, 'transaction operation count')
	return transaction
}

export const getTransactionOperations = async (
	hash: string,
	limit: number,
	cursor?: string
) => {
	if (!/^[0-9a-f]{64}$/.test(hash))
		throw new Error('StellarHorizon_Rest: invalid transaction hash')
	const parameters = pageParameters(limit, cursor)
	parameters.set('order', 'asc')
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
		}
	const page = await query<StellarHorizonPage<StellarHorizonOperation>>(
		`/transactions/${encodeURIComponent(hash)}/operations?${parameters.toString()}`
	)
	assertPage(page, limit, cursor)
	for (const operation of page._embedded.records) {
		if (operation.transaction_hash !== hash)
			throw new Error('StellarHorizon_Rest: operation page contains a foreign transaction')
		assertUnsignedInteger(operation.type_i, 'operation type index')
	}
	return page
}

export const operationIndexFromHorizonId = (
	operationId: string
) => {
	try {
		const index = Number(BigInt(operationId) & 0xfffn)
		if (!Number.isSafeInteger(index) || index < 0)
			throw new Error()
		return index
	} catch {
		throw new Error('StellarHorizon_Rest: invalid operation ID')
	}
}
