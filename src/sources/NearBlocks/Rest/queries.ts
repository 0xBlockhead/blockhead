import { getJson } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type {
	NearBlocksAccountResponse,
	NearBlocksBlockResponse,
	NearBlocksTransactionResponse,
	NearBlocksV3AccountBalance,
	NearBlocksV3Response,
	NearBlocksV3Transaction,
} from '$/sources/NearBlocks/Rest/types.ts'

export const nearBlocksMainnetRestEndpoints = [
	{
		url: 'https://api.nearblocks.io',
		transportType: TransportType.Http,
		providerName: 'NearBlocks',
	},
] as const

export const nearBlocksOrigins = [
	{
		origin: 'https://api.nearblocks.io',
		corsEnabled: true,
	},
] as const

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')

const assertNearMainnetBinding = (binding: SourceBinding) => {
	if (
		binding.source !== Source.NearBlocks_Rest
		|| binding.target.kind !== SourceTargetKind.NetworkSlug
		|| binding.target.key !== 'near'
	)
		throw new Error('NearBlocks_Rest: expected canonical NEAR mainnet binding')
}

const v3Url = (
	binding: SourceBinding,
	path: string
) => {
	assertNearMainnetBinding(binding)
	return new URL(path, firstHttpUrlForBinding(binding))
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
	restBaseUrl,
	accountId,
}: {
	restBaseUrl: string
	accountId: string
}) => (
	getJson<NearBlocksAccountResponse>(
		`${base(restBaseUrl)}/v1/account/${encodeURIComponent(accountId)}`,
		{ origins: nearBlocksOrigins }
	)
)

export const getBlock = ({
	restBaseUrl,
	block,
}: {
	restBaseUrl: string
	block: bigint | string
}) => (
	getJson<NearBlocksBlockResponse>(
		`${base(restBaseUrl)}/v1/blocks/${encodeURIComponent(String(block))}`,
		{ origins: nearBlocksOrigins }
	)
)

export const getTransaction = ({
	restBaseUrl,
	transactionHash,
}: {
	restBaseUrl: string
	transactionHash: string
}) => (
	getJson<NearBlocksTransactionResponse>(
		`${base(restBaseUrl)}/v1/txns/${encodeURIComponent(transactionHash)}`,
		{ origins: nearBlocksOrigins }
	)
)

export const getAccountBalance = async (
	binding: SourceBinding,
	accountId: string
) => {
	if (accountId.length === 0)
		throw new Error('NearBlocks_Rest: account ID must not be empty')

	const response = await sourceGetJson<NearBlocksV3Response<NearBlocksV3AccountBalance>>(
		binding,
		v3Url(
			binding,
			`/v3/accounts/${encodeURIComponent(accountId)}/balance`
		).toString()
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
	binding: SourceBinding,
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

	const url = v3Url(
		binding,
		`/v3/accounts/${encodeURIComponent(accountId)}/txns`
	)
	url.searchParams.set('limit', limit.toString())
	if (next != null)
		url.searchParams.set('next', next)

	const response = await sourceGetJson<NearBlocksV3Response<NearBlocksV3Transaction[]>>(
		binding,
		url.toString()
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
		for (const [value, label] of [
			[transaction.actions_agg.deposit, 'transaction deposit'],
			[transaction.actions_agg.gas_attached, 'transaction attached gas'],
			[transaction.outcomes_agg.gas_used, 'transaction gas used'],
			[transaction.outcomes_agg.transaction_fee, 'transaction fee'],
			[transaction.receipt_conversion_gas_burnt, 'receipt conversion gas burnt'],
			[transaction.receipt_conversion_tokens_burnt, 'receipt conversion tokens burnt'],
		] as const)
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
