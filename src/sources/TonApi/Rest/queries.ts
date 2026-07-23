import { type as arktype, type Type } from 'arktype'

import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	TonApiAccount,
	TonApiAccountTransactionWire,
	TonApiAccountTransactionsPage,
	TonApiAccountTransactionsWire,
	TonApiMasterchainHead,
} from '$/sources/TonApi/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const tonApiAccount = arktype({
	address: 'string',
	balance: 'string',
	last_activity: 'number.integer >= 0',
	status: "'uninit' | 'active' | 'frozen'",
	interfaces: 'string[]',
	get_methods: 'string[]',
	is_wallet: 'boolean',
}) satisfies Type<TonApiAccount>

const tonApiMasterchainHead = arktype({
	seqno: 'number.integer >= 0',
	gen_utime: 'number.integer >= 0',
}) satisfies Type<TonApiMasterchainHead>

const tonApiAccountTransaction = arktype({
	hash: 'string',
	lt: 'number.integer >= 0',
	account: {
		address: 'string',
		is_scam: 'boolean',
		is_wallet: 'boolean',
	},
	success: 'boolean',
	utime: 'number.integer >= 0',
	total_fees: 'number.integer >= 0',
	end_balance: 'number.integer >= 0',
	transaction_type: 'string',
	block: 'string',
	aborted: 'boolean',
	destroyed: 'boolean',
}) satisfies Type<TonApiAccountTransactionWire>

const tonApiAccountTransactions = arktype({
	transactions: tonApiAccountTransaction.array(),
}) satisfies Type<TonApiAccountTransactionsWire>

const rawTonAddressCoordinates = (address: string) => {
	const coordinates = /^(-?\d+):([0-9a-fA-F]{64})$/.exec(address)
	if (coordinates == null || !Number.isSafeInteger(Number(coordinates[1])))
		throw new Error('TonApi_Rest: malformed raw account address')

	return `${Number(coordinates[1])}:${coordinates[2].toLowerCase()}`
}

const assertTonApiBinding = (binding: SourceBinding) => {
	if (
		binding.source !== Source.TonApi_Rest
		|| binding.target.kind !== SourceTargetKind.Caip2Network
		|| binding.target.key !== 'ton:-239'
	)
		throw new Error('TonApi_Rest: expected canonical TON mainnet binding')
}

export const getAccount = (
	binding: SourceBinding,
	accountId: string
) => (
	getJson<unknown>(
		binding,
		`/v2/accounts/${encodeURIComponent(accountId)}`
	).then((wire) => {
		const account = tonApiAccount.assert(wire)
		if (!/^(?:0|[1-9]\d*)$/.test(account.balance))
			throw new Error('TonApi_Rest: account balance is not a non-negative decimal integer')

		return account
	})
)

export const getBlockchainMasterchainHead = (binding: SourceBinding) => (
	getJson<unknown>(
		binding,
		'/v2/blockchain/masterchain-head'
	).then((wire) => {
		const masterchainHead = tonApiMasterchainHead.assert(wire)
		if (
			!Number.isSafeInteger(masterchainHead.seqno)
			|| !Number.isSafeInteger(masterchainHead.gen_utime * 1_000)
		)
			throw new Error('TonApi_Rest: masterchain head exceeds safe numeric bounds')

		return masterchainHead
	})
)

export const getBlockchainAccountTransactions = async (
	binding: SourceBinding,
	{
		accountId,
		limit,
		beforeLt,
	}: {
		accountId: string
		limit: number
		beforeLt?: bigint
	}
): Promise<TonApiAccountTransactionsPage> => {
	assertTonApiBinding(binding)
	const canonicalAccountId = rawTonAddressCoordinates(accountId)
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 1_000)
		throw new Error('TonApi_Rest: transaction limit must be an integer from 0 through 1000')
	if (beforeLt != null && beforeLt < 0n)
		throw new Error('TonApi_Rest: transaction continuation must be non-negative')
	if (limit === 0)
		return {
			transactions: [],
		}

	const parameters = new URLSearchParams({
		limit: limit.toString(),
		sort_order: 'desc',
	})
	if (beforeLt != null)
		parameters.set('before_lt', beforeLt.toString())
	const page = tonApiAccountTransactions.assert(await getJson<unknown>(
		binding,
		`/v2/blockchain/accounts/${encodeURIComponent(accountId)}/transactions?${parameters.toString()}`
	))
	if (page.transactions.length > limit)
		throw new Error('TonApi_Rest: transaction page exceeds requested limit')

	const hashes = new Set<string>()
	let previousLt = beforeLt
	const transactions = page.transactions.map((transaction) => {
		if (
			!Number.isSafeInteger(transaction.lt)
			|| !Number.isSafeInteger(transaction.utime)
			|| !Number.isSafeInteger(transaction.total_fees)
			|| !Number.isSafeInteger(transaction.end_balance)
		)
			throw new Error('TonApi_Rest: transaction numeric field exceeds lossless JSON bounds')
		if (rawTonAddressCoordinates(transaction.account.address) !== canonicalAccountId)
			throw new Error('TonApi_Rest: transaction page contains a foreign account row')
		if (!/^[0-9a-fA-F]{64}$/.test(transaction.hash))
			throw new Error('TonApi_Rest: malformed transaction hash')
		const hash = transaction.hash.toLowerCase()
		if (hashes.has(hash))
			throw new Error('TonApi_Rest: transaction page contains a duplicate hash')
		hashes.add(hash)
		const lt = BigInt(transaction.lt)
		if (previousLt != null && lt >= previousLt)
			throw new Error('TonApi_Rest: transaction page is not strictly newest-first')
		previousLt = lt

		return {
			hash,
			lt,
			accountAddress: transaction.account.address,
			success: transaction.success,
			utime: transaction.utime,
			totalFeesNano: BigInt(transaction.total_fees),
			endBalanceNano: BigInt(transaction.end_balance),
			transactionType: transaction.transaction_type,
			block: transaction.block,
			aborted: transaction.aborted,
			destroyed: transaction.destroyed,
		}
	})

	return {
		transactions,
		...(
			transactions.length === limit
			&& transactions.length > 0
			&& {
				nextBeforeLt: transactions.at(-1)?.lt,
			}
		),
	}
}
