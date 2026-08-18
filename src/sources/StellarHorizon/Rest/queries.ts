import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/StellarHorizon/bindings.ts'
import {
	stellarHorizonAccountWire,
	stellarHorizonAccountPageWire,
	stellarHorizonClaimableBalancePageWire,
	stellarHorizonClaimableBalanceWire,
	stellarHorizonLiquidityPoolPageWire,
	stellarHorizonLiquidityPoolWire,
	stellarHorizonOfferWire,
	stellarHorizonOfferPageWire,
	stellarHorizonEffectPageWire,
	stellarHorizonOperationPageWire,
	stellarHorizonPaymentPageWire,
	stellarHorizonTradePageWire,
	stellarHorizonTransactionPageWire,
	stellarHorizonTransactionWire,
	type StellarHorizonAssetIdentity,
	type StellarHorizonBalance,
	type StellarHorizonClaimableBalance,
	type StellarHorizonEffect,
	type StellarHorizonLiquidityPool,
	type StellarHorizonLiquidityPoolReserve,
	type StellarHorizonOffer,
	type StellarHorizonOperation,
	type StellarHorizonPage,
	type StellarHorizonPayment,
	type StellarHorizonTrade,
	type StellarHorizonTransaction,
} from '$/sources/StellarHorizon/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const assertAccountId = (
	accountId: string,
	label = 'account ID'
) => {
	if (!/^G[A-Z2-7]{55}$/.test(accountId))
		throw new Error(`StellarHorizon_Rest: invalid ${label}`)
}

const assertLiquidityPoolId = (
	liquidityPoolId: string
) => {
	if (!/^[0-9a-f]{64}$/.test(liquidityPoolId))
		throw new Error('StellarHorizon_Rest: invalid liquidity pool ID')
}

const assertClaimableBalanceId = (
	claimableBalanceId: string
) => {
	if (!/^[0-9a-f]{72}$/.test(claimableBalanceId))
		throw new Error('StellarHorizon_Rest: invalid claimable balance ID')
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

const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object')
		return Object.fromEntries(
			Object.entries(value)
				.map(([key, entry]) => [
					key,
					omitUndefinedJson(entry),
				])
		)
	return value
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(omitUndefinedJson(response))
	} catch {
		throw new Error(`StellarHorizon_Rest: invalid ${label} response envelope`)
	}
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

const liquidityPoolReserveFromWire = (
	reserve: StellarHorizonLiquidityPoolReserve
) => {
	assertAmount(reserve.amount, 'liquidity pool reserve')
	if (reserve.asset === 'native')
		return {
			assetKey: 'XLM',
			assetKind: 'native',
			amount: reserve.amount,
		}

	const assetSeparatorIndex = reserve.asset.indexOf(':')
	if (assetSeparatorIndex < 1)
		throw new Error('StellarHorizon_Rest: invalid liquidity pool reserve asset')

	const assetCode = reserve.asset.slice(0, assetSeparatorIndex)
	const issuer = reserve.asset.slice(assetSeparatorIndex + 1)
	if (!/^[A-Za-z0-9]{1,12}$/.test(assetCode) || issuer.includes(':'))
		throw new Error('StellarHorizon_Rest: invalid liquidity pool reserve asset')
	assertAccountId(issuer, 'liquidity pool reserve issuer')

	return {
		assetKey: `${assetCode}-${issuer}`,
		assetKind: assetCode.length <= 4 ? 'credit_alphanum4' : 'credit_alphanum12',
		assetCode,
		issuer,
		amount: reserve.amount,
	}
}

const liquidityPoolFromWire = (
	liquidityPool: StellarHorizonLiquidityPool
) => {
	assertLiquidityPoolId(liquidityPool.id)
	if (liquidityPool.type !== 'constant_product')
		throw new Error('StellarHorizon_Rest: unsupported liquidity pool type')
	if (liquidityPool.fee_bp > 4_294_967_295)
		throw new Error('StellarHorizon_Rest: invalid liquidity pool fee')
	assertAmount(liquidityPool.total_shares, 'liquidity pool total shares')
	assertUnsignedInteger(liquidityPool.last_modified_ledger, 'liquidity pool ledger')
	const timestampMs = Date.parse(liquidityPool.last_modified_time)
	if (!Number.isSafeInteger(timestampMs))
		throw new Error('StellarHorizon_Rest: invalid liquidity pool modification time')

	const accounts = Number(liquidityPool.total_trustlines)
	if (!Number.isSafeInteger(accounts) || accounts < 0 || String(accounts) !== liquidityPool.total_trustlines)
		throw new Error('StellarHorizon_Rest: invalid liquidity pool trustline count')
	if (liquidityPool.reserves.length !== 2)
		throw new Error('StellarHorizon_Rest: constant-product liquidity pool must have two reserves')

	const reserveA = liquidityPoolReserveFromWire(liquidityPool.reserves[0])
	const reserveB = liquidityPoolReserveFromWire(liquidityPool.reserves[1])
	if (reserveA.assetKey === reserveB.assetKey)
		throw new Error('StellarHorizon_Rest: liquidity pool reserves must have distinct assets')

	return {
		liquidityPoolId: liquidityPool.id,
		pagingToken: liquidityPool.paging_token,
		poolType: liquidityPool.type,
		feeBps: liquidityPool.fee_bp,
		accounts,
		totalShares: liquidityPool.total_shares,
		ledgerSequence: BigInt(liquidityPool.last_modified_ledger),
		timestampMs,
		reserveA,
		reserveB,
	}
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

const emptyPage = <_Record>(): StellarHorizonPage<_Record> => ({
	_links: {
		next: {
			href: '',
		},
	},
	_embedded: {
		records: [],
	},
})

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

const query = (
	path: string
) => (
	getJson(bindings[Source.StellarHorizon_Rest][0], path)
)

const assertTransactionDomain = (
	transaction: StellarHorizonTransaction
) => {
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

const assertOfferDomain = (
	offer: StellarHorizonOffer
) => {
	if (!/^\d+$/.test(offer.id))
		throw new Error('StellarHorizon_Rest: invalid offer ID')
	assertAccountId(offer.seller, 'offer seller')
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

const assertClaimableBalanceDomain = (
	claimableBalance: StellarHorizonClaimableBalance
) => {
	assertClaimableBalanceId(claimableBalance.id.toLowerCase())
	assertAmount(claimableBalance.amount, 'claimable balance amount')
	assertUnsignedInteger(claimableBalance.last_modified_ledger, 'claimable balance ledger')
	if (!Number.isSafeInteger(Date.parse(claimableBalance.last_modified_time)))
		throw new Error('StellarHorizon_Rest: invalid claimable balance modification time')
	if (claimableBalance.sponsor != null)
		assertAccountId(claimableBalance.sponsor, 'claimable balance sponsor')
	if (claimableBalance.asset !== 'native') {
		const assetSeparatorIndex = claimableBalance.asset.indexOf(':')
		if (assetSeparatorIndex < 1)
			throw new Error('StellarHorizon_Rest: invalid claimable balance asset')
		const assetCode = claimableBalance.asset.slice(0, assetSeparatorIndex)
		const issuer = claimableBalance.asset.slice(assetSeparatorIndex + 1)
		if (!/^[A-Za-z0-9]{1,12}$/.test(assetCode) || issuer.includes(':'))
			throw new Error('StellarHorizon_Rest: invalid claimable balance asset')
		assertAccountId(issuer, 'claimable balance asset issuer')
	}
	for (const claimant of claimableBalance.claimants)
		assertAccountId(claimant.destination, 'claimable balance claimant')
}

const claimableBalanceFromWire = (
	claimableBalance: StellarHorizonClaimableBalance
) => {
	assertClaimableBalanceDomain(claimableBalance)
	return {
		...claimableBalance,
		id: claimableBalance.id.toLowerCase(),
	}
}

const assertTradeDomain = (
	trade: StellarHorizonTrade
) => {
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

export const getAccount = async (
	accountId: string
) => {
	assertAccountId(accountId)
	const account = assertEnvelope(
		'account',
		stellarHorizonAccountWire,
		await query(accountPath(accountId))
	)
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

export const getLiquidityPool = async (
	liquidityPoolId: string
) => {
	assertLiquidityPoolId(liquidityPoolId)
	const liquidityPool = assertEnvelope(
		'liquidity pool',
		stellarHorizonLiquidityPoolWire,
		await query(`/liquidity_pools/${encodeURIComponent(liquidityPoolId)}`)
	)
	if (liquidityPool.id !== liquidityPoolId)
		throw new Error('StellarHorizon_Rest: liquidity pool response identity mismatch')

	return liquidityPoolFromWire(liquidityPool)
}

export const getLiquidityPools = async (
	limit: number,
	cursor?: string
) => {
	const parameters = pageParameters(limit, cursor)
	if (limit === 0)
		return emptyPage<ReturnType<typeof liquidityPoolFromWire>>()

	const page = assertEnvelope(
		'liquidity pool page',
		stellarHorizonLiquidityPoolPageWire,
		await query(`/liquidity_pools?${parameters.toString()}`)
	)
	assertPage(page, limit, cursor)

	return {
		...page,
		_embedded: {
			...page._embedded,
			records: page._embedded.records.map(liquidityPoolFromWire),
		},
	}
}

export const getOffer = async (
	offerId: string
) => {
	if (!/^\d+$/.test(offerId))
		throw new Error('StellarHorizon_Rest: invalid offer ID')
	const offer = assertEnvelope(
		'offer',
		stellarHorizonOfferWire,
		await query(`/offers/${encodeURIComponent(offerId)}`)
	)
	if (offer.id !== offerId)
		throw new Error('StellarHorizon_Rest: offer response identity mismatch')
	assertOfferDomain(offer)
	return offer
}

const getAccountPage = async <_Record extends {
	id: string
	paging_token: string
}>(
	accountId: string,
	resource: 'operations' | 'payments' | 'transactions' | 'offers' | 'trades',
	label: string,
	pageWire: { assert: (value: unknown) => StellarHorizonPage<_Record> },
	limit: number,
	cursor?: string
) => {
	assertAccountId(accountId)
	const parameters = pageParameters(limit, cursor)
	if (limit === 0)
		return emptyPage<_Record>()
	const page = assertEnvelope(
		label,
		pageWire,
		await query(`${accountPath(accountId)}/${resource}?${parameters.toString()}`)
	)
	assertPage(page, limit, cursor)
	return page
}

const getNetworkPage = async <_Record extends {
	id: string
	paging_token: string
}>(
	resource: 'accounts' | 'operations' | 'transactions' | 'offers' | 'trades',
	label: string,
	pageWire: { assert: (value: unknown) => StellarHorizonPage<_Record> },
	limit: number,
	cursor?: string
) => {
	const parameters = pageParameters(limit, cursor)
	if (limit === 0)
		return emptyPage<_Record>()
	const page = assertEnvelope(
		label,
		pageWire,
		await query(`/${resource}?${parameters.toString()}`)
	)
	assertPage(page, limit, cursor)
	return page
}

export const getAccounts = async (
	limit: number,
	cursor?: string
) => {
	const page = await getNetworkPage(
		'accounts',
		'account page',
		stellarHorizonAccountPageWire,
		limit,
		cursor
	)
	for (const account of page._embedded.records) {
		assertAccountId(account.account_id)
		if (account.id !== account.account_id)
			throw new Error('StellarHorizon_Rest: account page identity mismatch')
	}
	return page
}

export const getTransactions = async (
	limit: number,
	cursor?: string
) => {
	const page = await getNetworkPage(
		'transactions',
		'transaction page',
		stellarHorizonTransactionPageWire,
		limit,
		cursor
	)
	for (const transaction of page._embedded.records)
		assertTransactionDomain(transaction)
	return page
}

export const getOperations = async (
	limit: number,
	cursor?: string
) => {
	const page = await getNetworkPage(
		'operations',
		'operation page',
		stellarHorizonOperationPageWire,
		limit,
		cursor
	)
	for (const operation of page._embedded.records) {
		if (!/^[0-9a-f]{64}$/.test(operation.transaction_hash))
			throw new Error('StellarHorizon_Rest: operation is missing transaction identity')
		assertUnsignedInteger(operation.type_i, 'operation type index')
		operationIndexFromHorizonId(operation.id)
	}
	return page
}

export const getOffers = async (
	limit: number,
	cursor?: string
) => {
	const page = await getNetworkPage(
		'offers',
		'offer page',
		stellarHorizonOfferPageWire,
		limit,
		cursor
	)
	for (const offer of page._embedded.records)
		assertOfferDomain(offer)
	return page
}

export const getTrades = async (
	limit: number,
	cursor?: string
) => {
	const page = await getNetworkPage(
		'trades',
		'trade page',
		stellarHorizonTradePageWire,
		limit,
		cursor
	)
	for (const trade of page._embedded.records)
		assertTradeDomain(trade)
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
		'payment page',
		stellarHorizonPaymentPageWire,
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
		'operation page',
		stellarHorizonOperationPageWire,
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
		'transaction page',
		stellarHorizonTransactionPageWire,
		limit,
		cursor
	)
	for (const transaction of page._embedded.records)
		assertTransactionDomain(transaction)
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
		'offer page',
		stellarHorizonOfferPageWire,
		limit,
		cursor
	)
	for (const offer of page._embedded.records) {
		if (offer.seller !== accountId)
			throw new Error('StellarHorizon_Rest: offer page contains a foreign seller')
		assertOfferDomain(offer)
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
		'trade page',
		stellarHorizonTradePageWire,
		limit,
		cursor
	)
	for (const trade of page._embedded.records) {
		if (
			trade.base_account !== accountId
			&& trade.counter_account !== accountId
		)
			throw new Error('StellarHorizon_Rest: trade page contains a foreign account row')
		assertTradeDomain(trade)
	}
	return page
}

export const getOfferTrades = async (
	offerId: string,
	limit: number,
	cursor?: string
) => {
	if (!/^\d+$/.test(offerId))
		throw new Error('StellarHorizon_Rest: invalid offer ID')
	const parameters = pageParameters(limit, cursor)
	if (limit === 0)
		return emptyPage<StellarHorizonTrade>()
	const page = assertEnvelope(
		'offer trade page',
		stellarHorizonTradePageWire,
		await query(`/offers/${encodeURIComponent(offerId)}/trades?${parameters.toString()}`)
	)
	assertPage(page, limit, cursor)
	for (const trade of page._embedded.records) {
		assertTradeDomain(trade)
		if (
			trade.offer_id !== offerId
			&& trade.base_offer_id !== offerId
			&& trade.counter_offer_id !== offerId
		)
			throw new Error('StellarHorizon_Rest: offer trade page contains a foreign offer')
	}
	return page
}

export const getTransaction = async (
	hash: string
) => {
	if (!/^[0-9a-f]{64}$/.test(hash))
		throw new Error('StellarHorizon_Rest: invalid transaction hash')
	const transaction = assertEnvelope(
		'transaction',
		stellarHorizonTransactionWire,
		await query(`/transactions/${encodeURIComponent(hash)}`)
	)
	if (transaction.hash !== hash)
		throw new Error('StellarHorizon_Rest: transaction response identity mismatch')
	assertTransactionDomain(transaction)
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
		return emptyPage<StellarHorizonOperation>()
	const page = assertEnvelope(
		'transaction operation page',
		stellarHorizonOperationPageWire,
		await query(`/transactions/${encodeURIComponent(hash)}/operations?${parameters.toString()}`)
	)
	assertPage(page, limit, cursor)
	for (const operation of page._embedded.records) {
		if (operation.transaction_hash !== hash)
			throw new Error('StellarHorizon_Rest: operation page contains a foreign transaction')
		assertUnsignedInteger(operation.type_i, 'operation type index')
	}
	return page
}

export const getLedgerTransactions = async (
	sequence: bigint,
	limit: number,
	cursor?: string
) => {
	if (sequence < 0n)
		throw new Error('StellarHorizon_Rest: ledger sequence must be nonnegative')
	const parameters = pageParameters(limit, cursor)
	if (limit === 0)
		return emptyPage<StellarHorizonTransaction>()
	const page = assertEnvelope(
		'ledger transaction page',
		stellarHorizonTransactionPageWire,
		await query(`/ledgers/${sequence.toString()}/transactions?${parameters.toString()}`)
	)
	assertPage(page, limit, cursor)
	for (const transaction of page._embedded.records) {
		assertTransactionDomain(transaction)
		if (BigInt(transaction.ledger) !== sequence)
			throw new Error('StellarHorizon_Rest: transaction page contains a foreign ledger')
	}
	return page
}

export const getLedgerOperations = async (
	sequence: bigint,
	limit: number,
	cursor?: string
) => {
	if (sequence < 0n)
		throw new Error('StellarHorizon_Rest: ledger sequence must be nonnegative')
	const parameters = pageParameters(limit, cursor)
	if (limit === 0)
		return emptyPage<StellarHorizonOperation>()
	const page = assertEnvelope(
		'ledger operation page',
		stellarHorizonOperationPageWire,
		await query(`/ledgers/${sequence.toString()}/operations?${parameters.toString()}`)
	)
	assertPage(page, limit, cursor)
	for (const operation of page._embedded.records) {
		if (operation.transaction_hash.length === 0)
			throw new Error('StellarHorizon_Rest: operation is missing transaction identity')
		assertUnsignedInteger(operation.type_i, 'operation type index')
	}
	return page
}

export const parseOperationIdFromEffectId = (
	effectId: string
) => {
	const match = /^0*(\d+)-0*\d+$/.exec(effectId)
	if (match == null)
		throw new Error('StellarHorizon_Rest: invalid effect ID')
	return match[1]
}

const assertEffectDomain = (
	effect: StellarHorizonEffect
) => {
	parseOperationIdFromEffectId(effect.id)
	assertUnsignedInteger(effect.type_i, 'effect type index')
	if (effect.account != null)
		assertAccountId(effect.account)
}

const assertEffectPage = (
	page: StellarHorizonPage<StellarHorizonEffect>,
	limit: number,
	cursor?: string
) => {
	assertPage(page, limit, cursor)
	for (const effect of page._embedded.records)
		assertEffectDomain(effect)
}

export const getLedgerEffects = async (
	sequence: bigint,
	limit: number,
	cursor?: string
) => {
	if (sequence < 0n)
		throw new Error('StellarHorizon_Rest: ledger sequence must be nonnegative')
	const parameters = pageParameters(limit, cursor)
	if (limit === 0)
		return emptyPage<StellarHorizonEffect>()
	const page = assertEnvelope(
		'ledger effect page',
		stellarHorizonEffectPageWire,
		await query(`/ledgers/${sequence.toString()}/effects?${parameters.toString()}`)
	)
	assertEffectPage(page, limit, cursor)
	for (const effect of page._embedded.records) {
		if ((BigInt(parseOperationIdFromEffectId(effect.id)) >> 32n) !== sequence)
			throw new Error('StellarHorizon_Rest: effect page contains a foreign ledger')
	}
	return page
}

export const getTransactionEffects = async (
	hash: string,
	limit: number,
	cursor?: string
) => {
	if (!/^[0-9a-f]{64}$/.test(hash))
		throw new Error('StellarHorizon_Rest: invalid transaction hash')
	const parameters = pageParameters(limit, cursor)
	if (limit === 0)
		return emptyPage<StellarHorizonEffect>()
	const page = assertEnvelope(
		'transaction effect page',
		stellarHorizonEffectPageWire,
		await query(`/transactions/${encodeURIComponent(hash)}/effects?${parameters.toString()}`)
	)
	assertEffectPage(page, limit, cursor)
	return page
}

export const getOperationEffects = async (
	operationId: string,
	limit: number,
	cursor?: string
) => {
	const canonicalOperationId = (() => {
		try {
			const value = BigInt(operationId)
			if (value < 0n)
				throw new Error()
			return value.toString()
		} catch {
			throw new Error('StellarHorizon_Rest: invalid operation ID')
		}
	})()
	const parameters = pageParameters(limit, cursor)
	if (limit === 0)
		return emptyPage<StellarHorizonEffect>()
	const page = assertEnvelope(
		'operation effect page',
		stellarHorizonEffectPageWire,
		await query(`/operations/${encodeURIComponent(canonicalOperationId)}/effects?${parameters.toString()}`)
	)
	assertEffectPage(page, limit, cursor)
	for (const effect of page._embedded.records) {
		if (parseOperationIdFromEffectId(effect.id) !== canonicalOperationId)
			throw new Error('StellarHorizon_Rest: effect page contains a foreign operation')
	}
	return page
}

export const getEffect = async (
	effectId: string
) => {
	const operationId = parseOperationIdFromEffectId(effectId)
	const page = await getOperationEffects(operationId, 200)
	const effect = page._embedded.records.find((record) => record.id === effectId)
	if (effect == null)
		throw new Error('StellarHorizon_Rest: effect not found on owning operation')
	return effect
}

export const getClaimableBalance = async (
	claimableBalanceId: string
) => {
	const canonicalId = claimableBalanceId.toLowerCase()
	assertClaimableBalanceId(canonicalId)
	const claimableBalance = assertEnvelope(
		'claimable balance',
		stellarHorizonClaimableBalanceWire,
		await query(`/claimable_balances/${encodeURIComponent(canonicalId)}`)
	)
	const snapshot = claimableBalanceFromWire(claimableBalance)
	if (snapshot.id !== canonicalId)
		throw new Error('StellarHorizon_Rest: claimable balance response identity mismatch')
	return snapshot
}

export const getClaimableBalances = async (
	limit: number,
	cursor?: string,
	asset?: string
) => {
	const parameters = pageParameters(limit, cursor)
	if (asset != null)
		parameters.set('asset', asset)
	if (limit === 0)
		return emptyPage<ReturnType<typeof claimableBalanceFromWire>>()

	const page = assertEnvelope(
		'claimable balance page',
		stellarHorizonClaimableBalancePageWire,
		await query(`/claimable_balances?${parameters.toString()}`)
	)
	assertPage(page, limit, cursor)

	const records = page._embedded.records.map(claimableBalanceFromWire)
	if (asset != null) {
		for (const claimableBalance of records) {
			if (claimableBalance.asset !== asset)
				throw new Error('StellarHorizon_Rest: claimable balance page contains a foreign asset row')
		}
	}

	return {
		...page,
		_embedded: {
			...page._embedded,
			records,
		},
	}
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
