import { getJson as getNearBlocksRestJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	NearBlocksAccountResponse,
	NearBlocksBlockResponse,
	NearBlocksTransactionResponse,
	NearBlocksV3AccountBalance,
	NearBlocksV3Response,
	NearBlocksV3Transaction,
} from '$/sources/NearBlocks/Rest/types.ts'
import bindings from '$/sources/NearBlocks/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.NearBlocks_Rest][0]

const getNearBlocksJson = <_Response>(path: string) => (
	getNearBlocksRestJson<_Response>(binding, path)
)

const assertNonnegativeIntegerString = (
	value: string,
	label: string
) => {
	try {
		const integer = BigInt(value)
		if (integer < 0n)
			throw new Error()
		return integer
	} catch {
		throw new Error(`NearBlocks_Rest: invalid ${label}`)
	}
}

const assertV3Success = <_Data>(
	response: NearBlocksV3Response<_Data>,
	label: string
) => {
	if (response.errors?.length)
		throw new Error(`NearBlocks_Rest: ${label}: ${response.errors[0].message}`)
	if (response.data == null)
		throw new Error(`NearBlocks_Rest: ${label}: missing data`)
	return response.data
}

export const getAccount = ({
	accountId,
}: {
	accountId: string
}) => (
	getNearBlocksJson<NearBlocksAccountResponse>(
		`/v1/account/${encodeURIComponent(accountId)}`
	)
)

export const getBlock = ({
	block,
}: {
	block: bigint | string
}) => (
	getNearBlocksJson<NearBlocksBlockResponse>(
		`/v1/blocks/${encodeURIComponent(String(block))}`
	)
)

export const getTransaction = ({
	transactionHash,
}: {
	transactionHash: string
}) => (
	getNearBlocksJson<NearBlocksTransactionResponse>(
		`/v1/txns/${encodeURIComponent(transactionHash)}`
	)
)

export const getAccountBalance = async (
	accountId: string
) => {
	if (accountId.length === 0)
		throw new Error('NearBlocks_Rest: account ID must not be empty')

	const response = await getNearBlocksJson<NearBlocksV3Response<NearBlocksV3AccountBalance>>(
		`/v3/accounts/${encodeURIComponent(accountId)}/balance`
	)
	const balance = assertV3Success(response, `account balance ${accountId}`)
	if (balance.account_id !== accountId)
		throw new Error('NearBlocks_Rest: account balance identity does not match request')
	assertNonnegativeIntegerString(balance.amount, 'account amount')
	assertNonnegativeIntegerString(balance.amount_staked, 'account staked amount')
	assertNonnegativeIntegerString(balance.storage_usage, 'account storage usage')
	return balance
}

export const getAccountTransactions = async (
	{
		accountId,
		limit,
		next,
	}: {
		accountId: string
		limit: number
		next?: string
	}
) => {
	if (accountId.length === 0)
		throw new Error('NearBlocks_Rest: account ID must not be empty')
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 100)
		throw new Error('NearBlocks_Rest: transaction limit must be an integer from 0 through 100')
	if (next === '')
		throw new Error('NearBlocks_Rest: transaction continuation must not be empty')
	if (limit === 0)
		return {
			transactions: [],
			continuationToken: undefined,
		}

	const parameters = new URLSearchParams({ limit: limit.toString() })
	if (next != null)
		parameters.set('next', next)

	const response = await getNearBlocksJson<NearBlocksV3Response<NearBlocksV3Transaction[]>>(
		`/v3/accounts/${encodeURIComponent(accountId)}/txns?${parameters}`
	)
	const transactions = assertV3Success(response, `account transactions ${accountId}`)
	if (transactions.length > limit)
		throw new Error('NearBlocks_Rest: transaction page exceeds requested limit')

	const transactionHashes = new Set<string>()
	let previousBlockTimestamp: bigint | undefined
	for (const transaction of transactions) {
		if (
			transaction.signer_account_id !== accountId
			&& transaction.receiver_account_id !== accountId
		)
			throw new Error('NearBlocks_Rest: transaction page contains a foreign account row')
		if (
			transaction.transaction_hash.length === 0
			|| transactionHashes.has(transaction.transaction_hash)
		)
			throw new Error('NearBlocks_Rest: transaction page contains an invalid or duplicate hash')
		transactionHashes.add(transaction.transaction_hash)
		assertNonnegativeIntegerString(transaction.block.block_height, 'transaction block height')
		const blockTimestamp = assertNonnegativeIntegerString(
			transaction.block.block_timestamp,
			'transaction block timestamp'
		)
		if (
			previousBlockTimestamp != null
			&& blockTimestamp > previousBlockTimestamp
		)
			throw new Error('NearBlocks_Rest: transaction page is not newest-first')
		previousBlockTimestamp = blockTimestamp
		if (
			transaction.block.block_hash.length === 0
			|| transaction.signer_account_id.length === 0
			|| transaction.receiver_account_id.length === 0
			|| transaction.actions.some((action) => (
				action.action.length === 0
				|| action.method === ''
			))
			|| !Number.isSafeInteger(transaction.index_in_chunk)
			|| transaction.index_in_chunk < 0
			|| !Number.isSafeInteger(transaction.shard_id)
			|| transaction.shard_id < 0
		)
			throw new Error('NearBlocks_Rest: transaction page contains malformed identity or action data')
		if (
			transaction.block_timestamp != null
			&& transaction.block_timestamp !== transaction.block.block_timestamp
		)
			throw new Error('NearBlocks_Rest: transaction block timestamp does not match nested block context')
		for (const [label, value] of Object.entries({
			'transaction deposit': transaction.actions_agg.deposit,
			'transaction attached gas': transaction.actions_agg.gas_attached,
			'transaction gas used': transaction.outcomes_agg.gas_used,
			'transaction fee': transaction.outcomes_agg.transaction_fee,
			'receipt conversion gas burnt': transaction.receipt_conversion_gas_burnt,
			'receipt conversion tokens burnt': transaction.receipt_conversion_tokens_burnt,
		}))
			if (value != null)
				assertNonnegativeIntegerString(value, label)
	}

	if (response.meta?.next_page === '')
		throw new Error('NearBlocks_Rest: transaction continuation must not be empty')
	if (response.meta?.next_page === next)
		throw new Error('NearBlocks_Rest: transaction continuation did not advance')

	return {
		transactions,
		continuationToken: response.meta?.next_page,
	}
}
