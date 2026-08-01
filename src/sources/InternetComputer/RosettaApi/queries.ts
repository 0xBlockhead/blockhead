import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type {
	InternetComputerRosettaAccountBalanceResponse,
	InternetComputerRosettaAmount,
	InternetComputerRosettaBlockIdentifier,
	InternetComputerRosettaSearchTransactionsResponse,
} from '$/sources/InternetComputer/RosettaApi/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

const networkIdentifier = {
	blockchain: 'Internet Computer',
	network: '00000000000000020101',
}

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

const assertIntegerString = (
	value: string,
	label: string
) => {
	try {
		BigInt(value)
	} catch {
		throw new Error(`InternetComputer_RosettaApi: invalid ${label}`)
	}
}

const assertBlockIdentifier = (blockIdentifier: InternetComputerRosettaBlockIdentifier) => {
	assertSafeUnsignedInteger(blockIdentifier.index, 'block index')
	if (!/^[0-9a-f]{64}$/.test(blockIdentifier.hash))
		throw new Error('InternetComputer_RosettaApi: invalid block hash')
}

const assertAmount = (
	amount: InternetComputerRosettaAmount,
	label: string
) => {
	assertIntegerString(amount.value, label)
	if (amount.currency.symbol !== 'ICP' || amount.currency.decimals !== 8)
		throw new Error('InternetComputer_RosettaApi: unexpected account currency')
}

export const request = async <_Response>(
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
	return response.json<_Response>()
}

export const getAccountBalance = async (
	binding: SourceBinding,
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

	const result = await request<InternetComputerRosettaAccountBalanceResponse>(
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
	assertBlockIdentifier(result.block_identifier)
	if (result.balances.length !== 1)
		throw new Error('InternetComputer_RosettaApi: account balance response must contain exactly ICP')
	assertAmount(result.balances[0], 'account balance')
	if (BigInt(result.balances[0].value) < 0n)
		throw new Error('InternetComputer_RosettaApi: account balance must not be negative')
	return result
}

export const getAccountTransactions = async (
	binding: SourceBinding,
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
		} satisfies InternetComputerRosettaSearchTransactionsResponse

	const result = await request<InternetComputerRosettaSearchTransactionsResponse>(
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
		assertBlockIdentifier(blockTransaction.block_identifier)
		if (
			!/^[0-9a-f]{64}$/.test(blockTransaction.transaction.transaction_identifier.hash)
			|| transactionHashes.has(blockTransaction.transaction.transaction_identifier.hash)
		)
			throw new Error('InternetComputer_RosettaApi: invalid or duplicate transaction hash')
		transactionHashes.add(blockTransaction.transaction.transaction_identifier.hash)
		if (
			!blockTransaction.transaction.operations.some((operation) => (
				operation.account?.address === accountIdentifier
			))
		)
			throw new Error('InternetComputer_RosettaApi: transaction page contains a foreign account row')

		const operationIndexes = new Set<number>()
		for (const operation of blockTransaction.transaction.operations) {
			assertSafeUnsignedInteger(operation.operation_identifier.index, 'operation index')
			if (operationIndexes.has(operation.operation_identifier.index))
				throw new Error('InternetComputer_RosettaApi: duplicate operation index')
			operationIndexes.add(operation.operation_identifier.index)
			if (operation.account != null)
				assertAccountIdentifier(operation.account.address)
			if (operation.amount != null)
				assertAmount(operation.amount, 'operation amount')
		}
	}
	return result
}
