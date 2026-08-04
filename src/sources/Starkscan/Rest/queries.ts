import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Starkscan/bindings.ts'
import type { components } from '$/sources/Starkscan/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Starkscan][0]

type AddressSummary = components['schemas']['AddressSummaryView']
type AddressTransactionPage = components['schemas']['AddressTransactionPage']
type AddressTokenHoldings = components['schemas']['AddressTokenHoldingsView']
type ContractEventPage = components['schemas']['ContractEventPage']

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

export const getAddressSummary = async (
	address: string
) => {
	assertFelt(address, 'account address')
	const summary = await getJson<AddressSummary>(
		binding,
		`/v1/SN_MAIN/address/${encodeURIComponent(address)}`
	)
	if (!sameFelt(summary.address, address))
		throw new Error('Starkscan: address summary does not match request')
	assertSafeUnsigned(summary.totalActivityCount, 'total activity count')
	if (summary.latestActivityBlock != null)
		assertSafeUnsigned(summary.latestActivityBlock, 'latest activity block')
	if (summary.classHash != null)
		assertFelt(summary.classHash, 'class hash')
	if (summary.deployedAtTxHash != null)
		assertFelt(summary.deployedAtTxHash, 'deployed transaction hash')
	if (summary.deployedByAddress != null)
		assertFelt(summary.deployedByAddress, 'deployer address')
	if (summary.contractExistence != null) {
		if (
			summary.contractExistence.status !== 'not_deployed'
			|| summary.contractExistence.reasonCode !== 'contract_not_found'
			|| summary.contractExistence.evidenceSource !== 'finalized_class_hash_at'
		)
			throw new Error('Starkscan: invalid contract existence evidence')
		assertSafeUnsigned(summary.contractExistence.observedBlockNumber, 'existence observation block')
		assertFelt(summary.contractExistence.observedBlockHash, 'existence observation block hash')
	}
	if (summary.classHash != null && summary.contractExistence != null)
		throw new Error('Starkscan: address summary has conflicting class and not-deployed evidence')
	if (summary.classHash == null && summary.contractExistence == null)
		throw new Error('Starkscan: address summary lacks contract existence evidence')
	if (summary.classHash != null && summary.latestActivityBlock == null)
		throw new Error('Starkscan: address summary lacks observation block')
	return summary
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

export const getContractEvents = async (
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
	assertFelt(address, 'contract address')
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 100)
		throw new Error('Starkscan: event limit must be an integer from 0 through 100')
	if (cursor === '')
		throw new Error('Starkscan: event cursor must not be empty')
	if (cursor != null && !/^[0-9]+:[0-9]+:[0-9]+$/.test(cursor))
		throw new Error('Starkscan: malformed event cursor')
	if (limit === 0)
		return {
			items: [],
			nextCursor: null,
			eventDecodingDegraded: false,
		}

	const parameters = new URLSearchParams({
		limit: limit.toString(),
	})
	if (cursor != null)
		parameters.set('cursor', cursor)
	const page = await getJson<ContractEventPage>(
		binding,
		`/v1/SN_MAIN/contract/${encodeURIComponent(address)}/events?${parameters.toString()}`
	)
	if (page.items.length > limit)
		throw new Error('Starkscan: event page exceeds requested limit')
	if (page.eventDecodingDegraded)
		throw new Error('Starkscan: event decoding is operationally degraded')

	const identities = new Set<string>()
	let previousBlockNumber: number | undefined
	let previousTransactionIndex: number | undefined
	let previousLogIndex: number | undefined
	for (const event of page.items) {
		assertFelt(event.txHash, 'event transaction hash')
		assertFelt(event.address, 'event contract address')
		if (!sameFelt(event.address, address))
			throw new Error('Starkscan: event page contains a foreign contract row')
		assertSafeUnsigned(event.blockNumber, 'event block number')
		assertSafeUnsigned(event.txIndex, 'event transaction index')
		assertSafeUnsigned(event.logIndex, 'event log index')
		if (
			previousBlockNumber != null
			&& (
				event.blockNumber > previousBlockNumber
				|| (
					event.blockNumber === previousBlockNumber
					&& previousTransactionIndex != null
					&& (
						event.txIndex > previousTransactionIndex
						|| (
							event.txIndex === previousTransactionIndex
							&& previousLogIndex != null
							&& event.logIndex > previousLogIndex
						)
					)
				)
			)
		)
			throw new Error('Starkscan: event page is not newest-first')
		previousBlockNumber = event.blockNumber
		previousTransactionIndex = event.txIndex
		previousLogIndex = event.logIndex
		const identity = `${event.blockNumber}:${event.txIndex}:${event.logIndex}`
		if (identities.has(identity))
			throw new Error('Starkscan: event page contains a duplicate log')
		identities.add(identity)
		for (const key of event.keys)
			assertFelt(key, 'event key')
		for (const value of event.data)
			assertFelt(value, 'event data')
		const timestampMs = Date.parse(event.timestampIso)
		if (
			!/^\d{4}-\d{2}-\d{2}T/.test(event.timestampIso)
			|| !Number.isSafeInteger(timestampMs)
			|| timestampMs < 0
		)
			throw new Error('Starkscan: invalid event timestamp')
	}
	if (page.nextCursor === '')
		throw new Error('Starkscan: event cursor must not be empty')
	if (page.nextCursor != null) {
		if (!/^[0-9]+:[0-9]+:[0-9]+$/.test(page.nextCursor))
			throw new Error('Starkscan: malformed event cursor')
		if (page.nextCursor === cursor)
			throw new Error('Starkscan: event cursor did not advance')
	}
	return page
}
