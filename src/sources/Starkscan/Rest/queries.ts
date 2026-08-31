import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Starkscan/bindings.ts'
import {
	starkscanAddressSummaryEnvelope,
	starkscanAddressTransactionPageEnvelope,
	starkscanBlockEnvelope,
	starkscanClassDetailEnvelope,
	starkscanContractEventPageEnvelope,
	starkscanFelt,
	starkscanTokenHoldingsEnvelope,
	starkscanTransactionEnvelope,
} from '$/sources/Starkscan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Starkscan][0]

const assertEnvelope = <_Value>(
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown,
	label: string
): _Value => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Starkscan_Rest: invalid ${label} envelope`)
	}
}

const assertFelt = (
	value: string,
	label: string
) => {
	try {
		starkscanFelt.assert(value)
	} catch {
		throw new Error(`Starkscan_Rest: invalid ${label}`)
	}
}

const sameFelt = (
	left: string | null | undefined,
	right: string
) => {
	if (left == null)
		return false
	try {
		starkscanFelt.assert(left)
		return BigInt(left) === BigInt(right)
	} catch {
		return false
	}
}

const gasPriceString = (
	gasPrice: {
		priceInWei: string | null
		priceInFri: string | null
	} | null,
	_label: string
) => {
	if (gasPrice == null)
		return undefined
	return gasPrice.priceInWei ?? gasPrice.priceInFri ?? undefined
}

export const getBlock = async (
	numberOrHash: string
) => {
	if (
		!(
			/^[0-9]+$/.test(numberOrHash)
			|| (
				/^0[xX][0-9a-fA-F]{1,64}$/.test(numberOrHash)
				&& BigInt(numberOrHash) < 2n ** 251n
			)
		)
	)
		throw new Error('Starkscan_Rest: invalid block number or hash')

	const block = assertEnvelope(
		starkscanBlockEnvelope,
		await getJson(
			binding,
			`/v1/SN_MAIN/block/${encodeURIComponent(numberOrHash)}?tx_limit=200`
		),
		'block'
	)
	if (block.chainId !== 'SN_MAIN')
		throw new Error('Starkscan_Rest: block chain does not match Starknet mainnet')
	if (
		/^[0-9]+$/.test(numberOrHash)
		&& block.blockNumber !== Number(numberOrHash)
	)
		throw new Error('Starkscan_Rest: block number does not match request')
	if (
		/^0[xX]/.test(numberOrHash)
		&& !sameFelt(block.blockHash, numberOrHash)
	)
		throw new Error('Starkscan_Rest: block hash does not match request')
	const timestampMs = Date.parse(block.timestampIso)
	if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
		throw new Error('Starkscan_Rest: invalid block timestamp')
	gasPriceString(block.l1GasPrice, 'l1 gas price')
	gasPriceString(block.l1DataGasPrice, 'l1 data gas price')
	gasPriceString(block.l2GasPrice, 'l2 gas price')
	if (block.transactions.length > 200)
		throw new Error('Starkscan_Rest: block transaction preview exceeds certified cap')
	if (block.transactions.length > block.txCount)
		throw new Error('Starkscan_Rest: block transaction preview exceeds reported count')

	const hashes = new Set<string>()
	let previousIndex: number | undefined
	for (const transaction of block.transactions) {
		if (previousIndex != null && transaction.txIndex <= previousIndex)
			throw new Error('Starkscan_Rest: block transactions are not ascending by index')
		previousIndex = transaction.txIndex
		const transactionHash = BigInt(transaction.txHash).toString(16)
		if (hashes.has(transactionHash))
			throw new Error('Starkscan_Rest: block contains a duplicate transaction hash')
		hashes.add(transactionHash)
	}
	return block
}

export const getTransaction = async (
	transactionHash: string
) => {
	assertFelt(transactionHash, 'transaction hash')
	const transaction = assertEnvelope(
		starkscanTransactionEnvelope,
		await getJson(
			binding,
			`/v1/SN_MAIN/tx/${encodeURIComponent(transactionHash)}?logLimit=96`
		),
		'transaction'
	)
	if (transaction.chainId !== 'SN_MAIN')
		throw new Error('Starkscan_Rest: transaction chain does not match Starknet mainnet')
	if (!sameFelt(transaction.txHash, transactionHash))
		throw new Error('Starkscan_Rest: transaction hash does not match request')
	if (transaction.logsTruncated)
		throw new Error('Starkscan_Rest: transaction logs are truncated')
	if (transaction.eventDecodingDegraded)
		throw new Error('Starkscan_Rest: event decoding is operationally degraded')
	if (transaction.logs.length > 96)
		throw new Error('Starkscan_Rest: transaction logs exceed requested logLimit')
	if (transaction.calldata.length > 1024)
		throw new Error('Starkscan_Rest: transaction calldata exceeds certified cap')
	const logIndexes = new Set<number>()
	for (const log of transaction.logs) {
		if (logIndexes.has(log.logIndex))
			throw new Error('Starkscan_Rest: transaction contains a duplicate log index')
		logIndexes.add(log.logIndex)
	}
	if (transaction.timestampIso != null) {
		const timestampMs = Date.parse(transaction.timestampIso)
		if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
			throw new Error('Starkscan_Rest: invalid transaction timestamp')
	}
	if (
		transaction.messagesCoverage.status !== 'exact'
		|| (
			transaction.messagesCoverage.reasonCode !== 'indexed_protocol_message_facts'
			&& transaction.messagesCoverage.reasonCode !== 'no_matching_message_rows'
		)
	)
		throw new Error(`Starkscan_Rest: transaction messages are incomplete (${transaction.messagesCoverage.reasonCode})`)
	return transaction
}

export const getClass = async (
	{
		classHash,
		limit,
		cursor,
	}: {
		classHash: string
		limit: number
		cursor?: string
	}
) => {
	assertFelt(classHash, 'class hash')
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error('Starkscan_Rest: class instance limit must be an integer from 1 through 100')
	if (cursor === '')
		throw new Error('Starkscan_Rest: class instance cursor must not be empty')

	const parameters = new URLSearchParams({
		instanceLimit: limit.toString(),
		instanceSort: 'address_asc',
	})
	if (cursor != null)
		parameters.set('instanceCursor', cursor)
	const detail = assertEnvelope(
		starkscanClassDetailEnvelope,
		await getJson(
			binding,
			`/v1/SN_MAIN/class/${encodeURIComponent(classHash)}?${parameters.toString()}`
		),
		'class detail'
	)
	if (detail.class.chainId !== 'SN_MAIN')
		throw new Error('Starkscan_Rest: class chain does not match Starknet mainnet')
	if (!sameFelt(detail.class.classHash, classHash))
		throw new Error('Starkscan_Rest: class hash does not match request')
	if (detail.instances.length > limit)
		throw new Error('Starkscan_Rest: class instance page exceeds requested limit')

	const addresses = new Set<string>()
	for (const instance of detail.instances) {
		const normalized = BigInt(instance.address).toString(16)
		if (addresses.has(normalized))
			throw new Error('Starkscan_Rest: class instance page contains a duplicate address')
		addresses.add(normalized)
	}
	if (detail.nextInstanceCursor != null && detail.nextInstanceCursor === cursor)
		throw new Error('Starkscan_Rest: class instance cursor did not advance')
	return detail
}

export const getAddressSummary = async (
	address: string
) => {
	assertFelt(address, 'account address')
	const summary = assertEnvelope(
		starkscanAddressSummaryEnvelope,
		await getJson(
			binding,
			`/v1/SN_MAIN/address/${encodeURIComponent(address)}`
		),
		'address summary'
	)
	if (!sameFelt(summary.address, address))
		throw new Error('Starkscan_Rest: address summary does not match request')
	if (summary.classHash != null && summary.contractExistence != null)
		throw new Error('Starkscan_Rest: address summary has conflicting class and not-deployed evidence')
	if (summary.classHash == null && summary.contractExistence == null)
		throw new Error('Starkscan_Rest: address summary lacks contract existence evidence')
	if (summary.classHash != null && summary.latestActivityBlock == null)
		throw new Error('Starkscan_Rest: address summary lacks observation block')
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
		throw new Error('Starkscan_Rest: transaction limit must be an integer from 0 through 100')
	if (cursor === '')
		throw new Error('Starkscan_Rest: transaction cursor must not be empty')
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
	const page = assertEnvelope(
		starkscanAddressTransactionPageEnvelope,
		await getJson(
			binding,
			`/v1/SN_MAIN/address/${encodeURIComponent(address)}/transactions?${parameters.toString()}`
		),
		'address transactions'
	)
	if (page.items.length > limit)
		throw new Error('Starkscan_Rest: transaction page exceeds requested limit')

	const hashes = new Set<string>()
	let previousBlockNumber: number | undefined
	let previousTransactionIndex: number | undefined
	for (const transaction of page.items) {
		const transactionHash = BigInt(transaction.txHash).toString(16)
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
			throw new Error('Starkscan_Rest: transaction page is not newest-first')
		previousBlockNumber = transaction.blockNumber
		previousTransactionIndex = transaction.txIndex
		if (
			!sameFelt(transaction.fromAddress, address)
			&& !sameFelt(transaction.toAddress, address)
		)
			throw new Error('Starkscan_Rest: transaction page contains a foreign account row')
		if (hashes.has(transactionHash))
			throw new Error('Starkscan_Rest: transaction page contains a duplicate hash')
		hashes.add(transactionHash)
		if (transaction.timestampIso != null) {
			const timestampMs = Date.parse(transaction.timestampIso)
			if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
				throw new Error('Starkscan_Rest: invalid transaction timestamp')
		}
	}
	if (page.nextCursor != null && page.nextCursor === cursor)
		throw new Error('Starkscan_Rest: transaction cursor did not advance')
	return page
}

export const getExactTokenHoldings = async (
	address: string
) => {
	assertFelt(address, 'account address')
	const holdings = assertEnvelope(
		starkscanTokenHoldingsEnvelope,
		await getJson(
			binding,
			`/v1/SN_MAIN/address/${encodeURIComponent(address)}/token-holdings`
		),
		'token holdings'
	)
	if (holdings.chainId !== 'SN_MAIN')
		throw new Error('Starkscan_Rest: token holdings chain does not match Starknet mainnet')
	if (!sameFelt(holdings.ownerAddress, address))
		throw new Error('Starkscan_Rest: token holdings owner does not match request')
	if (
		!holdings.exact
		|| holdings.truncated
		|| !holdings.completeness.exact
		|| holdings.completeness.truncated
		|| !holdings.completeness.complete
		|| holdings.completeness.reasonCode !== 'complete'
	)
		throw new Error(`Starkscan_Rest: token holdings are incomplete (${holdings.completeness.reasonCode})`)
	if (holdings.items.length > 256)
		throw new Error('Starkscan_Rest: token holdings exceed the certified response cap')

	const tokenAddresses = new Set<string>()
	for (const holding of holdings.items) {
		if (!sameFelt(holding.tokenAddress, holding.normalizedTokenAddress))
			throw new Error('Starkscan_Rest: token holding address normalization mismatch')
		if (tokenAddresses.has(holding.normalizedTokenAddress))
			throw new Error('Starkscan_Rest: duplicate token holding')
		tokenAddresses.add(holding.normalizedTokenAddress)
	}
	return {
		...holdings,
		fetchedAtMs: Date.now(),
	}
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
		throw new Error('Starkscan_Rest: event limit must be an integer from 0 through 100')
	if (cursor === '')
		throw new Error('Starkscan_Rest: event cursor must not be empty')
	if (cursor != null && !/^[0-9]+:[0-9]+:[0-9]+$/.test(cursor))
		throw new Error('Starkscan_Rest: malformed event cursor')
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
	const page = assertEnvelope(
		starkscanContractEventPageEnvelope,
		await getJson(
			binding,
			`/v1/SN_MAIN/contract/${encodeURIComponent(address)}/events?${parameters.toString()}`
		),
		'contract events'
	)
	if (page.items.length > limit)
		throw new Error('Starkscan_Rest: event page exceeds requested limit')
	if (page.eventDecodingDegraded)
		throw new Error('Starkscan_Rest: event decoding is operationally degraded')

	const identities = new Set<string>()
	let previousBlockNumber: number | undefined
	let previousTransactionIndex: number | undefined
	let previousLogIndex: number | undefined
	for (const event of page.items) {
		if (!sameFelt(event.address, address))
			throw new Error('Starkscan_Rest: event page contains a foreign contract row')
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
			throw new Error('Starkscan_Rest: event page is not newest-first')
		previousBlockNumber = event.blockNumber
		previousTransactionIndex = event.txIndex
		previousLogIndex = event.logIndex
		const identity = `${event.blockNumber}:${event.txIndex}:${event.logIndex}`
		if (identities.has(identity))
			throw new Error('Starkscan_Rest: event page contains a duplicate log')
		identities.add(identity)
		const timestampMs = Date.parse(event.timestampIso)
		if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
			throw new Error('Starkscan_Rest: invalid event timestamp')
	}
	if (page.nextCursor != null) {
		if (!/^[0-9]+:[0-9]+:[0-9]+$/.test(page.nextCursor))
			throw new Error('Starkscan_Rest: malformed event cursor')
		if (page.nextCursor === cursor)
			throw new Error('Starkscan_Rest: event cursor did not advance')
	}
	return page
}
