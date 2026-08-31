import { getJson as getNearBlocksRestJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import {
	nearBlocksAccountResponseWire,
	nearBlocksBlockResponseWire,
	nearBlocksTransactionResponseWire,
	nearBlocksV3AccountBalanceResponseWire,
	nearBlocksV3TransactionPageResponseWire,
	type NearBlocksAccount,
	type NearBlocksBlock,
	type NearBlocksTransaction,
	type NearBlocksV3Response,
} from '$/sources/NearBlocks/Rest/types.ts'
import bindings from '$/sources/NearBlocks/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getNearBlocksJson = (
	path: string
) => (
	getNearBlocksRestJson<unknown>(bindings[Source.NearBlocks_Rest][0], path)
)

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`NearBlocks_Rest: invalid ${label} response envelope`)
	}
}

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

const assertNonnegativeIntegerWire = (
	value: string | number,
	label: string
) => {
	if (typeof value === 'number') {
		if (!Number.isSafeInteger(value) || value < 0)
			throw new Error(`NearBlocks_Rest: invalid ${label}`)
		return BigInt(value)
	}

	return assertNonnegativeIntegerString(value, label)
}

const assertNonemptyString = (
	value: string,
	label: string
) => {
	if (value.length === 0)
		throw new Error(`NearBlocks_Rest: ${label} must not be empty`)
	return value
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

const assertAccount = (
	account: NearBlocksAccount,
	accountId: string
) => {
	if (account.account_id !== accountId)
		throw new Error('NearBlocks_Rest: account identity does not match request')
	assertNonnegativeIntegerString(account.amount, 'account amount')
	assertNonemptyString(account.block_hash, 'account block hash')
	assertNonnegativeIntegerWire(account.block_height, 'account block height')
	if (account.locked != null)
		assertNonnegativeIntegerString(account.locked, 'account locked amount')
	if (account.storage_usage != null)
		assertNonnegativeIntegerWire(account.storage_usage, 'account storage usage')
	return account
}

const assertBlock = (
	block: NearBlocksBlock,
	{
		hash,
		height,
		requirePrevBlockHash = false,
	}: {
		hash?: string
		height?: bigint
		requirePrevBlockHash?: boolean
	} = {}
) => {
	assertNonemptyString(block.block_hash, 'block hash')
	const blockHeight = assertNonnegativeIntegerWire(block.block_height, 'block height')
	assertNonnegativeIntegerString(block.block_timestamp, 'block timestamp')
	if (hash != null && block.block_hash !== hash)
		throw new Error('NearBlocks_Rest: block hash does not match request')
	if (height != null && blockHeight !== height)
		throw new Error('NearBlocks_Rest: block height does not match request')
	if (requirePrevBlockHash) {
		if (block.prev_block_hash == null)
			throw new Error('NearBlocks_Rest: previous block hash missing')
		assertNonemptyString(block.prev_block_hash, 'previous block hash')
	} else if (block.prev_block_hash != null)
		assertNonemptyString(block.prev_block_hash, 'previous block hash')
	if (block.epoch_id != null)
		assertNonemptyString(block.epoch_id, 'epoch id')
	if (block.gas_price != null)
		assertNonnegativeIntegerString(block.gas_price, 'block gas price')
	return block
}

const assertTransaction = (
	transaction: NearBlocksTransaction,
	transactionHash: string
) => {
	if (transaction.transaction_hash !== transactionHash)
		throw new Error('NearBlocks_Rest: transaction hash does not match request')
	assertNonemptyString(transaction.signer_account_id, 'transaction signer')
	assertNonemptyString(transaction.receiver_account_id, 'transaction receiver')
	assertNonnegativeIntegerString(transaction.block_timestamp, 'transaction block timestamp')
	assertNonemptyString(transaction.included_in_block_hash, 'included block hash')
	if (transaction.nonce != null)
		assertNonnegativeIntegerWire(transaction.nonce, 'transaction nonce')
	if (transaction.block?.block_height != null)
		assertNonnegativeIntegerWire(transaction.block.block_height, 'transaction block height')
	for (const action of transaction.actions) {
		if (action.action.length === 0)
			throw new Error('NearBlocks_Rest: transaction action kind must not be empty')
		if (action.method === '')
			throw new Error('NearBlocks_Rest: transaction method must not be empty')
	}
	for (const [label, value] of Object.entries({
		'transaction deposit': transaction.actions_agg?.deposit,
		'transaction attached gas': transaction.actions_agg?.gas_attached,
		'transaction gas used': transaction.outcomes_agg?.gas_used,
		'transaction fee': transaction.outcomes_agg?.transaction_fee,
		'receipt conversion gas burnt': transaction.receipt_conversion_gas_burnt,
		'receipt conversion tokens burnt': transaction.receipt_conversion_tokens_burnt,
	}))
		if (value != null)
			assertNonnegativeIntegerWire(value, label)
	return transaction
}

export const getAccount = async ({
	accountId,
}: {
	accountId: string
}) => {
	assertNonemptyString(accountId, 'account ID')
	const response = assertEnvelope(
		'account',
		nearBlocksAccountResponseWire,
		await getNearBlocksJson(`/v1/account/${encodeURIComponent(accountId)}`)
	)
	const account = response.account.at(0)
	if (account == null)
		throw new Error(`NearBlocks_Rest: account ${accountId} not found`)
	return assertAccount(account, accountId)
}

export const getBlock = async ({
	block,
}: {
	block: bigint | string
}) => {
	const response = assertEnvelope(
		'block',
		nearBlocksBlockResponseWire,
		await getNearBlocksJson(`/v1/blocks/${encodeURIComponent(String(block))}`)
	)
	const wireBlock = response.blocks.at(0)
	if (wireBlock == null)
		throw new Error(`NearBlocks_Rest: block ${String(block)} not found`)
	return (
		typeof block === 'bigint' ?
			assertBlock(wireBlock, {
				height: block,
				requirePrevBlockHash: true,
			})
		: /^\d+$/.test(block) ?
			assertBlock(wireBlock, {
				height: BigInt(block),
				requirePrevBlockHash: true,
			})
		:
			assertBlock(wireBlock, {
				hash: block,
				requirePrevBlockHash: true,
			})
	)
}

export const listBlocks = async ({
	limit,
}: {
	limit: number
}) => {
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 100)
		throw new Error('NearBlocks_Rest: block limit must be an integer from 0 through 100')
	if (limit === 0)
		return []

	const response = assertEnvelope(
		'blocks',
		nearBlocksBlockResponseWire,
		await getNearBlocksJson(`/v1/blocks?per_page=${limit}`)
	)
	if (response.blocks.length > limit)
		throw new Error('NearBlocks_Rest: block page exceeds requested limit')

	const blockHashes = new Set<string>()
	let previousHeight: bigint | undefined
	return response.blocks.map((block) => {
		const asserted = assertBlock(block)
		const height = assertNonnegativeIntegerWire(asserted.block_height, 'block height')
		if (blockHashes.has(asserted.block_hash))
			throw new Error('NearBlocks_Rest: block page contains a duplicate hash')
		blockHashes.add(asserted.block_hash)
		if (previousHeight != null && height >= previousHeight)
			throw new Error('NearBlocks_Rest: block page is not newest-first')
		previousHeight = height
		return asserted
	})
}

export const getTransaction = async ({
	transactionHash,
}: {
	transactionHash: string
}) => {
	assertNonemptyString(transactionHash, 'transaction hash')
	const response = assertEnvelope(
		'transaction',
		nearBlocksTransactionResponseWire,
		await getNearBlocksJson(`/v1/txns/${encodeURIComponent(transactionHash)}`)
	)
	const transaction = response.txns.at(0)
	if (transaction == null)
		throw new Error(`NearBlocks_Rest: transaction ${transactionHash} not found`)
	return assertTransaction(transaction, transactionHash)
}

export const getAccountBalance = async (
	accountId: string
) => {
	assertNonemptyString(accountId, 'account ID')

	const response = assertEnvelope(
		'account balance',
		nearBlocksV3AccountBalanceResponseWire,
		await getNearBlocksJson(`/v3/accounts/${encodeURIComponent(accountId)}/balance`)
	)
	const balance = assertV3Success(
		response,
		`account balance ${accountId}`
	)
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
	assertNonemptyString(accountId, 'account ID')
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

	const response = assertEnvelope(
		'account transactions',
		nearBlocksV3TransactionPageResponseWire,
		await getNearBlocksJson(`/v3/accounts/${encodeURIComponent(accountId)}/txns?${parameters}`)
	)
	const transactions = assertV3Success(
		response,
		`account transactions ${accountId}`
	)
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
