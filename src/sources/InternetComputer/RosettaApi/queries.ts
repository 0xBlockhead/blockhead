import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import {
	InternetComputerRosettaAccountBalanceResponse,
	InternetComputerRosettaAmount,
	InternetComputerRosettaBlockIdentifier,
	InternetComputerRosettaBlockResponse,
	InternetComputerRosettaNetworkOptionsResponse,
	InternetComputerRosettaNetworkStatusResponse,
	InternetComputerRosettaSearchTransactionsResponse,
} from '$/sources/InternetComputer/RosettaApi/types.ts'
import bindings from '$/sources/InternetComputer/bindings.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.InternetComputer_RosettaApi][0]

const networkIdentifier = {
	blockchain: 'Internet Computer',
	network: '00000000000000020101',
} as const

const assertAccountIdentifier = (accountIdentifier: string) => {
	if (!/^[0-9a-f]{64}$/.test(accountIdentifier))
		throw new Error('InternetComputer_RosettaApi: invalid ICP account identifier')
}

const assertSafeUnsignedInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`InternetComputer_RosettaApi: ${label} exceeds lossless JSON integer range`)
}

const assertIcpAmount = (
	amount: typeof InternetComputerRosettaAmount.infer,
	label: string
) => {
	if (amount.currency.symbol !== 'ICP' || amount.currency.decimals !== 8)
		throw new Error('InternetComputer_RosettaApi: unexpected account currency')
	try {
		BigInt(amount.value)
	} catch {
		throw new Error(`InternetComputer_RosettaApi: invalid ${label}`)
	}
}

const assertBlockIdentifierBounds = (
	blockIdentifier: typeof InternetComputerRosettaBlockIdentifier.infer
) => {
	assertSafeUnsignedInteger(blockIdentifier.index, 'block index')
}

const assertTransactionOperations = (
	operations: typeof InternetComputerRosettaSearchTransactionsResponse.infer['transactions'][number]['transaction']['operations'],
	accountIdentifier?: string
) => {
	const operationIndexes = new Set<number>()
	for (const operation of operations) {
		assertSafeUnsignedInteger(operation.operation_identifier.index, 'operation index')
		if (operationIndexes.has(operation.operation_identifier.index))
			throw new Error('InternetComputer_RosettaApi: duplicate operation index')
		operationIndexes.add(operation.operation_identifier.index)
		if (operation.account != null)
			assertAccountIdentifier(operation.account.address)
		if (operation.amount != null)
			assertIcpAmount(operation.amount, 'operation amount')
	}
	if (
		accountIdentifier != null
		&& !operations.some((operation) => (
			operation.account?.address === accountIdentifier
		))
	)
		throw new Error('InternetComputer_RosettaApi: transaction page contains a foreign account row')
}

const request = async (
	binding: SourceBinding,
	path: string,
	body: Readonly<Record<string, unknown>>
) => {
	const response = await sourceFetch(
		binding,
		new URL(path, firstHttpUrlForBinding(binding)).toString(),
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
		}
	)
	if (!response.ok)
		await throwHttpError(`${binding.source} ${path}`, response)
	return response.json()
}

export const getNetworkStatus = async (
) => {
	const result = InternetComputerRosettaNetworkStatusResponse.assert(
		await request(
			binding,
			'/network/status',
			{
				network_identifier: networkIdentifier,
			}
		)
	)
	assertBlockIdentifierBounds(result.current_block_identifier)
	assertBlockIdentifierBounds(result.genesis_block_identifier)
	assertSafeUnsignedInteger(result.current_block_timestamp, 'current block timestamp')
	return result
}

export const getNetworkOptions = async (
) => {
	return InternetComputerRosettaNetworkOptionsResponse.assert(
		await request(
			binding,
			'/network/options',
			{
				network_identifier: networkIdentifier,
			}
		)
	)
}

export const getBlock = async (
	blockIdentifier: {
		index?: number
		hash?: string
	}
) => {
	if (blockIdentifier.index != null)
		assertSafeUnsignedInteger(blockIdentifier.index, 'requested block index')
	if (blockIdentifier.hash != null && !/^[0-9a-f]{64}$/.test(blockIdentifier.hash))
		throw new Error('InternetComputer_RosettaApi: invalid requested block hash')
	if (blockIdentifier.index == null && blockIdentifier.hash == null)
		throw new Error('InternetComputer_RosettaApi: block lookup requires index or hash')

	const result = InternetComputerRosettaBlockResponse.assert(
		await request(
			binding,
			'/block',
			{
				network_identifier: networkIdentifier,
				block_identifier: blockIdentifier,
			}
		)
	)
	assertBlockIdentifierBounds(result.block.block_identifier)
	assertBlockIdentifierBounds(result.block.parent_block_identifier)
	assertSafeUnsignedInteger(result.block.timestamp, 'block timestamp')
	if (
		(blockIdentifier.index != null && result.block.block_identifier.index !== blockIdentifier.index)
		|| (blockIdentifier.hash != null && result.block.block_identifier.hash !== blockIdentifier.hash)
	)
		throw new Error('InternetComputer_RosettaApi: block response does not match request')
	if (result.block.transactions.length !== 1)
		throw new Error('InternetComputer_RosettaApi: ICP ledger block must contain exactly one transaction')
	const transactionHashes = new Set<string>()
	for (const transaction of result.block.transactions) {
		if (transactionHashes.has(transaction.transaction_identifier.hash))
			throw new Error('InternetComputer_RosettaApi: invalid or duplicate transaction hash')
		transactionHashes.add(transaction.transaction_identifier.hash)
		assertTransactionOperations(transaction.operations)
	}
	return result
}

export const getAccountBalance = async (
	accountIdentifier: string,
	blockIdentifier?: {
		index?: number
		hash?: string
	}
) => {
	assertAccountIdentifier(accountIdentifier)
	if (blockIdentifier?.index != null)
		assertSafeUnsignedInteger(blockIdentifier.index, 'requested block index')
	if (blockIdentifier?.hash != null && !/^[0-9a-f]{64}$/.test(blockIdentifier.hash))
		throw new Error('InternetComputer_RosettaApi: invalid requested block hash')

	const result = InternetComputerRosettaAccountBalanceResponse.assert(
		await request(
			binding,
			'/account/balance',
			{
				network_identifier: networkIdentifier,
				account_identifier: {
					address: accountIdentifier,
				},
				...(blockIdentifier != null && {
					block_identifier: blockIdentifier,
				}),
			}
		)
	)
	assertBlockIdentifierBounds(result.block_identifier)
	if (
		(blockIdentifier?.index != null && result.block_identifier.index !== blockIdentifier.index)
		|| (blockIdentifier?.hash != null && result.block_identifier.hash !== blockIdentifier.hash)
	)
		throw new Error('InternetComputer_RosettaApi: account balance response does not match requested block')
	if (result.balances.length !== 1)
		throw new Error('InternetComputer_RosettaApi: account balance response must contain exactly ICP')
	assertIcpAmount(result.balances[0], 'account balance')
	if (BigInt(result.balances[0].value) < 0n)
		throw new Error('InternetComputer_RosettaApi: account balance must not be negative')
	return result
}

export const getAccountTransactions = async (
	{
		accountIdentifier,
		limit,
		offset,
		maxBlock,
	}: {
		accountIdentifier: string
		limit: number
		offset?: number
		maxBlock?: number
	}
) => {
	assertAccountIdentifier(accountIdentifier)
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 1_000)
		throw new Error('InternetComputer_RosettaApi: transaction limit must be an integer from 0 through 1000')
	if (offset != null)
		assertSafeUnsignedInteger(offset, 'transaction offset')
	if (maxBlock != null)
		assertSafeUnsignedInteger(maxBlock, 'maximum block')
	if (limit === 0)
		return {
			transactions: [],
			total_count: 0,
		}

	const result = InternetComputerRosettaSearchTransactionsResponse.assert(
		await request(
			binding,
			'/search/transactions',
			{
				network_identifier: networkIdentifier,
				account_identifier: {
					address: accountIdentifier,
				},
				limit,
				...(offset != null && {
					offset,
				}),
				...(maxBlock != null && {
					max_block: maxBlock,
				}),
			}
		)
	)
	assertSafeUnsignedInteger(result.total_count, 'transaction count')
	if (result.transactions.length > limit)
		throw new Error('InternetComputer_RosettaApi: transaction page exceeds requested limit')
	if (result.next_offset != null) {
		assertSafeUnsignedInteger(result.next_offset, 'next transaction offset')
		if (result.next_offset === offset)
			throw new Error('InternetComputer_RosettaApi: transaction offset did not advance')
	}

	const transactionHashes = new Set<string>()
	for (const blockTransaction of result.transactions) {
		assertBlockIdentifierBounds(blockTransaction.block_identifier)
		if (transactionHashes.has(blockTransaction.transaction.transaction_identifier.hash))
			throw new Error('InternetComputer_RosettaApi: invalid or duplicate transaction hash')
		transactionHashes.add(blockTransaction.transaction.transaction_identifier.hash)
		assertTransactionOperations(
			blockTransaction.transaction.operations,
			accountIdentifier
		)
	}
	return result
}

export const searchTransactions = async (
	{
		limit,
		offset,
		maxBlock,
	}: {
		limit: number
		offset?: number
		maxBlock?: number
	}
) => {
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 1_000)
		throw new Error('InternetComputer_RosettaApi: transaction limit must be an integer from 0 through 1000')
	if (offset != null)
		assertSafeUnsignedInteger(offset, 'transaction offset')
	if (maxBlock != null)
		assertSafeUnsignedInteger(maxBlock, 'maximum block')
	if (limit === 0)
		return {
			transactions: [],
			total_count: 0,
		}

	const result = InternetComputerRosettaSearchTransactionsResponse.assert(
		await request(
			binding,
			'/search/transactions',
			{
				network_identifier: networkIdentifier,
				limit,
				...(offset != null && {
					offset,
				}),
				...(maxBlock != null && {
					max_block: maxBlock,
				}),
			}
		)
	)
	assertSafeUnsignedInteger(result.total_count, 'transaction count')
	if (result.transactions.length > limit)
		throw new Error('InternetComputer_RosettaApi: transaction page exceeds requested limit')
	if (result.next_offset != null) {
		assertSafeUnsignedInteger(result.next_offset, 'next transaction offset')
		if (result.next_offset === offset)
			throw new Error('InternetComputer_RosettaApi: transaction offset did not advance')
	}

	const transactionHashes = new Set<string>()
	for (const blockTransaction of result.transactions) {
		assertBlockIdentifierBounds(blockTransaction.block_identifier)
		if (transactionHashes.has(blockTransaction.transaction.transaction_identifier.hash))
			throw new Error('InternetComputer_RosettaApi: invalid or duplicate transaction hash')
		transactionHashes.add(blockTransaction.transaction.transaction_identifier.hash)
		assertTransactionOperations(blockTransaction.transaction.operations)
	}
	return result
}
