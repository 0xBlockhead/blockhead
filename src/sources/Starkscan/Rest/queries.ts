import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Starkscan/bindings.ts'
import type { components } from '$/sources/Starkscan/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Starkscan]

type AddressTransactionPage = components['schemas']['AddressTransactionPage']
type AddressTokenHoldings = components['schemas']['AddressTokenHoldingsView']

const assertFelt = (
	value: string,
	label: string
) => {
	if (
		!/^0[xX][0-9a-fA-F]{1,64}$/.test(value)
		|| BigInt(value) >= 2n ** 251n
	)
		throw new Error(`Starkscan: invalid ${label}`)
}

const sameFelt = (
	left: string | null,
	right: string
) => (
	left != null
	&& /^0[xX][0-9a-fA-F]{1,64}$/.test(left)
	&& BigInt(left) < 2n ** 251n
	&& BigInt(left) === BigInt(right)
)

const assertSafeUnsigned = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Starkscan: invalid ${label}`)
}

const assertNonnegativeDecimal = (
	value: string,
	label: string
) => {
	if (!/^[0-9]+$/.test(value))
		throw new Error(`Starkscan: invalid ${label}`)
}

export const getAddressTransactions = async (
	{
		address,
		limit,
		cursor,
	}: {
		address: string
		limit: number
		cursor?: string
	}
) => {
	assertFelt(address, 'account address')
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 100)
		throw new Error('Starkscan: transaction limit must be an integer from 0 through 100')
	if (cursor === '')
		throw new Error('Starkscan: transaction cursor must not be empty')
	if (limit === 0)
		return {
			items: [],
			nextCursor: null,
		}

	const parameters = new URLSearchParams({
		limit: limit.toString(),
	})
	if (cursor != null)
		parameters.set('cursor', cursor)
	const page = await getJson<AddressTransactionPage>(
		binding,
		`/v1/SN_MAIN/address/${encodeURIComponent(address)}/transactions?${parameters.toString()}`
	)
	if (page.items.length > limit)
		throw new Error('Starkscan: transaction page exceeds requested limit')

	const hashes = new Set<string>()
	let previousBlockNumber: number | undefined
	let previousTransactionIndex: number | undefined
	for (const transaction of page.items) {
		assertFelt(transaction.txHash, 'transaction hash')
		const transactionHash = BigInt(transaction.txHash).toString(16)
		assertSafeUnsigned(transaction.blockNumber, 'transaction block number')
		assertSafeUnsigned(transaction.txIndex, 'transaction index')
		if (
			previousBlockNumber != null
			&& (
				transaction.blockNumber > previousBlockNumber
				|| (
					transaction.blockNumber === previousBlockNumber
					&& previousTransactionIndex != null
					&& transaction.txIndex > previousTransactionIndex
				)
			)
		)
			throw new Error('Starkscan: transaction page is not newest-first')
		previousBlockNumber = transaction.blockNumber
		previousTransactionIndex = transaction.txIndex
		if (
			!sameFelt(transaction.fromAddress, address)
			&& !sameFelt(transaction.toAddress, address)
		)
			throw new Error('Starkscan: transaction page contains a foreign account row')
		if (hashes.has(transactionHash))
			throw new Error('Starkscan: transaction page contains a duplicate hash')
		hashes.add(transactionHash)
		if (transaction.topTransferAmount != null)
			assertNonnegativeDecimal(transaction.topTransferAmount, 'transfer amount')
		if (transaction.timestampIso != null) {
			const timestampMs = Date.parse(transaction.timestampIso)
			if (
				!/^\d{4}-\d{2}-\d{2}T/.test(transaction.timestampIso)
				|| !Number.isSafeInteger(timestampMs)
				|| timestampMs < 0
			)
				throw new Error('Starkscan: invalid transaction timestamp')
		}
	}
	if (page.nextCursor === '')
		throw new Error('Starkscan: transaction cursor must not be empty')
	if (page.nextCursor != null && page.nextCursor === cursor)
		throw new Error('Starkscan: transaction cursor did not advance')
	return page
}

export const getExactTokenHoldings = async (
	address: string
) => {
	assertFelt(address, 'account address')
	const holdings = await getJson<AddressTokenHoldings>(
		binding,
		`/v1/SN_MAIN/address/${encodeURIComponent(address)}/token-holdings`
	)
	if (holdings.chainId !== 'SN_MAIN')
		throw new Error('Starkscan: token holdings chain does not match Starknet mainnet')
	if (!sameFelt(holdings.ownerAddress, address))
		throw new Error('Starkscan: token holdings owner does not match request')
	if (
		!holdings.exact
		|| holdings.truncated
		|| !holdings.completeness.exact
		|| holdings.completeness.truncated
		|| !holdings.completeness.complete
		|| holdings.completeness.reasonCode !== 'complete'
	)
		throw new Error(`Starkscan: token holdings are incomplete (${holdings.completeness.reasonCode})`)
	if (holdings.items.length > 256)
		throw new Error('Starkscan: token holdings exceed the certified response cap')

	const tokenAddresses = new Set<string>()
	for (const holding of holdings.items) {
		assertFelt(holding.tokenAddress, 'token address')
		assertFelt(holding.normalizedTokenAddress, 'normalized token address')
		if (!sameFelt(holding.tokenAddress, holding.normalizedTokenAddress))
			throw new Error('Starkscan: token holding address normalization mismatch')
		if (tokenAddresses.has(holding.normalizedTokenAddress))
			throw new Error('Starkscan: duplicate token holding')
		tokenAddresses.add(holding.normalizedTokenAddress)
		assertNonnegativeDecimal(holding.indexedBalanceRaw, 'token balance')
		if (
			holding.decimals != null
			&& (!Number.isSafeInteger(holding.decimals) || holding.decimals < 0)
		)
			throw new Error('Starkscan: invalid token decimals')
	}
	return holdings
}
