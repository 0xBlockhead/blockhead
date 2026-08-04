import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Starkscan/bindings.ts'
import type { components } from '$/sources/Starkscan/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Starkscan][0]

type AddressSummary = components['schemas']['AddressSummaryView']
type AddressTransactionPage = components['schemas']['AddressTransactionPage']
type AddressTokenHoldings = components['schemas']['AddressTokenHoldingsView']
type BlockView = components['schemas']['BlockView']
type ClassDetail = components['schemas']['ClassDetailView']
type ContractEventPage = components['schemas']['ContractEventPage']
type TransactionDetail = components['schemas']['TransactionDetailView']

const assertFelt = (
	value: string,
	label: string
) => {
	if (
		!/^0[xX][0-9a-fA-F]{1,64}$/.test(value)
		|| BigInt(value) >= 2n ** 251n
	)
		throw new Error(`Starkscan_Rest: invalid ${label}`)
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
		throw new Error(`Starkscan_Rest: invalid ${label}`)
}

const assertNonnegativeDecimal = (
	value: string,
	label: string
) => {
	if (!/^[0-9]+$/.test(value))
		throw new Error(`Starkscan_Rest: invalid ${label}`)
}

const gasPriceString = (
	gasPrice: BlockView['l1GasPrice'],
	label: string
) => {
	if (gasPrice == null)
		return undefined
	const value = gasPrice.priceInWei ?? gasPrice.priceInFri
	if (value == null)
		return undefined
	assertNonnegativeDecimal(value, label)
	return value
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

	const block = await getJson<BlockView>(
		binding,
		`/v1/SN_MAIN/block/${encodeURIComponent(numberOrHash)}?tx_limit=200`
	)
	if (block.chainId !== 'SN_MAIN')
		throw new Error('Starkscan_Rest: block chain does not match Starknet mainnet')
	assertSafeUnsigned(block.blockNumber, 'block number')
	assertFelt(block.blockHash, 'block hash')
	assertFelt(block.parentHash, 'parent hash')
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
	if (
		!/^\d{4}-\d{2}-\d{2}T/.test(block.timestampIso)
		|| !Number.isSafeInteger(timestampMs)
		|| timestampMs < 0
	)
		throw new Error('Starkscan_Rest: invalid block timestamp')
	assertSafeUnsigned(block.txCount, 'block transaction count')
	if (block.rawObjectKey === '')
		throw new Error('Starkscan_Rest: block raw object key must not be empty')
	if (block.stateRoot != null)
		assertFelt(block.stateRoot, 'state root')
	if (block.sequencerAddress != null)
		assertFelt(block.sequencerAddress, 'sequencer address')
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
		assertFelt(transaction.txHash, 'block transaction hash')
		assertSafeUnsigned(transaction.txIndex, 'block transaction index')
		if (transaction.txCursor === '')
			throw new Error('Starkscan_Rest: block transaction cursor must not be empty')
		if (previousIndex != null && transaction.txIndex <= previousIndex)
			throw new Error('Starkscan_Rest: block transactions are not ascending by index')
		previousIndex = transaction.txIndex
		const transactionHash = BigInt(transaction.txHash).toString(16)
		if (hashes.has(transactionHash))
			throw new Error('Starkscan_Rest: block contains a duplicate transaction hash')
		hashes.add(transactionHash)
		if (transaction.fromAddress != null)
			assertFelt(transaction.fromAddress, 'block transaction sender')
		if (transaction.toAddress != null)
			assertFelt(transaction.toAddress, 'block transaction recipient')
	}
	return block
}

export const getTransaction = async (
	transactionHash: string
) => {
	assertFelt(transactionHash, 'transaction hash')
	const transaction = await getJson<TransactionDetail>(
		binding,
		`/v1/SN_MAIN/tx/${encodeURIComponent(transactionHash)}?logLimit=96`
	)
	if (transaction.chainId !== 'SN_MAIN')
		throw new Error('Starkscan_Rest: transaction chain does not match Starknet mainnet')
	if (!sameFelt(transaction.txHash, transactionHash))
		throw new Error('Starkscan_Rest: transaction hash does not match request')
	assertSafeUnsigned(transaction.blockNumber, 'transaction block number')
	assertSafeUnsigned(transaction.txIndex, 'transaction index')
	if (transaction.txCursor === '')
		throw new Error('Starkscan_Rest: transaction cursor must not be empty')
	if (transaction.rawObjectKey === '')
		throw new Error('Starkscan_Rest: transaction raw object key must not be empty')
	if (transaction.fromAddress != null)
		assertFelt(transaction.fromAddress, 'transaction sender')
	if (transaction.toAddress != null)
		assertFelt(transaction.toAddress, 'transaction recipient')
	if (transaction.logsTruncated)
		throw new Error('Starkscan_Rest: transaction logs are truncated')
	if (transaction.eventDecodingDegraded)
		throw new Error('Starkscan_Rest: event decoding is operationally degraded')
	if (transaction.logs.length > 96)
		throw new Error('Starkscan_Rest: transaction logs exceed requested logLimit')
	if (transaction.calldata.length > 1024)
		throw new Error('Starkscan_Rest: transaction calldata exceeds certified cap')
	for (const value of transaction.calldata)
		assertFelt(value, 'transaction calldata')
	const logIndexes = new Set<number>()
	for (const log of transaction.logs) {
		assertSafeUnsigned(log.logIndex, 'transaction log index')
		if (logIndexes.has(log.logIndex))
			throw new Error('Starkscan_Rest: transaction contains a duplicate log index')
		logIndexes.add(log.logIndex)
		assertFelt(log.address, 'transaction log address')
		for (const key of log.keys)
			assertFelt(key, 'transaction log key')
		for (const value of log.data)
			assertFelt(value, 'transaction log data')
	}
	if (transaction.timestampIso != null) {
		const timestampMs = Date.parse(transaction.timestampIso)
		if (
			!/^\d{4}-\d{2}-\d{2}T/.test(transaction.timestampIso)
			|| !Number.isSafeInteger(timestampMs)
			|| timestampMs < 0
		)
			throw new Error('Starkscan_Rest: invalid transaction timestamp')
	}
	if (transaction.receipt != null) {
		if (transaction.receipt.gasUsed != null)
			assertNonnegativeDecimal(transaction.receipt.gasUsed, 'receipt gas used')
		if (transaction.receipt.effectiveGasPrice != null)
			assertNonnegativeDecimal(transaction.receipt.effectiveGasPrice, 'receipt effective gas price')
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
	const detail = await getJson<ClassDetail>(
		binding,
		`/v1/SN_MAIN/class/${encodeURIComponent(classHash)}?${parameters.toString()}`
	)
	if (detail.class.chainId !== 'SN_MAIN')
		throw new Error('Starkscan_Rest: class chain does not match Starknet mainnet')
	if (!sameFelt(detail.class.classHash, classHash))
		throw new Error('Starkscan_Rest: class hash does not match request')
	if (detail.instances.length > limit)
		throw new Error('Starkscan_Rest: class instance page exceeds requested limit')
	assertSafeUnsigned(detail.class.instanceCount, 'class instance count')
	if (detail.class.compiledClassHash != null)
		assertFelt(detail.class.compiledClassHash, 'compiled class hash')
	if (detail.class.declarationTxHash != null)
		assertFelt(detail.class.declarationTxHash, 'declaration transaction hash')
	if (detail.class.declaredAtBlock != null)
		assertSafeUnsigned(detail.class.declaredAtBlock, 'declared at block')

	const addresses = new Set<string>()
	for (const instance of detail.instances) {
		assertFelt(instance.address, 'class instance address')
		const normalized = BigInt(instance.address).toString(16)
		if (addresses.has(normalized))
			throw new Error('Starkscan_Rest: class instance page contains a duplicate address')
		addresses.add(normalized)
		if (instance.evidenceTransactionHash != null)
			assertFelt(instance.evidenceTransactionHash, 'class instance evidence transaction')
		if (instance.deployedAtTxHash != null)
			assertFelt(instance.deployedAtTxHash, 'class instance deploy transaction')
		if (instance.deployedByAddress != null)
			assertFelt(instance.deployedByAddress, 'class instance deployer')
		if (instance.evidenceBlockNumber != null)
			assertSafeUnsigned(instance.evidenceBlockNumber, 'class instance evidence block')
		if (instance.deployedAtBlock != null)
			assertSafeUnsigned(instance.deployedAtBlock, 'class instance deploy block')
		if (instance.observedAtBlock != null)
			assertSafeUnsigned(instance.observedAtBlock, 'class instance observation block')
	}
	if (detail.nextInstanceCursor === '')
		throw new Error('Starkscan_Rest: class instance cursor must not be empty')
	if (detail.nextInstanceCursor != null && detail.nextInstanceCursor === cursor)
		throw new Error('Starkscan_Rest: class instance cursor did not advance')
	return detail
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
		throw new Error('Starkscan_Rest: address summary does not match request')
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
			throw new Error('Starkscan_Rest: invalid contract existence evidence')
		assertSafeUnsigned(summary.contractExistence.observedBlockNumber, 'existence observation block')
		assertFelt(summary.contractExistence.observedBlockHash, 'existence observation block hash')
	}
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
	const page = await getJson<AddressTransactionPage>(
		binding,
		`/v1/SN_MAIN/address/${encodeURIComponent(address)}/transactions?${parameters.toString()}`
	)
	if (page.items.length > limit)
		throw new Error('Starkscan_Rest: transaction page exceeds requested limit')

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
		if (transaction.topTransferAmount != null)
			assertNonnegativeDecimal(transaction.topTransferAmount, 'transfer amount')
		if (transaction.timestampIso != null) {
			const timestampMs = Date.parse(transaction.timestampIso)
			if (
				!/^\d{4}-\d{2}-\d{2}T/.test(transaction.timestampIso)
				|| !Number.isSafeInteger(timestampMs)
				|| timestampMs < 0
			)
				throw new Error('Starkscan_Rest: invalid transaction timestamp')
		}
	}
	if (page.nextCursor === '')
		throw new Error('Starkscan_Rest: transaction cursor must not be empty')
	if (page.nextCursor != null && page.nextCursor === cursor)
		throw new Error('Starkscan_Rest: transaction cursor did not advance')
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
		assertFelt(holding.tokenAddress, 'token address')
		assertFelt(holding.normalizedTokenAddress, 'normalized token address')
		if (!sameFelt(holding.tokenAddress, holding.normalizedTokenAddress))
			throw new Error('Starkscan_Rest: token holding address normalization mismatch')
		if (tokenAddresses.has(holding.normalizedTokenAddress))
			throw new Error('Starkscan_Rest: duplicate token holding')
		tokenAddresses.add(holding.normalizedTokenAddress)
		assertNonnegativeDecimal(holding.indexedBalanceRaw, 'token balance')
		if (
			holding.decimals != null
			&& (!Number.isSafeInteger(holding.decimals) || holding.decimals < 0)
		)
			throw new Error('Starkscan_Rest: invalid token decimals')
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
	const page = await getJson<ContractEventPage>(
		binding,
		`/v1/SN_MAIN/contract/${encodeURIComponent(address)}/events?${parameters.toString()}`
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
		assertFelt(event.txHash, 'event transaction hash')
		assertFelt(event.address, 'event contract address')
		if (!sameFelt(event.address, address))
			throw new Error('Starkscan_Rest: event page contains a foreign contract row')
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
			throw new Error('Starkscan_Rest: event page is not newest-first')
		previousBlockNumber = event.blockNumber
		previousTransactionIndex = event.txIndex
		previousLogIndex = event.logIndex
		const identity = `${event.blockNumber}:${event.txIndex}:${event.logIndex}`
		if (identities.has(identity))
			throw new Error('Starkscan_Rest: event page contains a duplicate log')
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
			throw new Error('Starkscan_Rest: invalid event timestamp')
	}
	if (page.nextCursor === '')
		throw new Error('Starkscan_Rest: event cursor must not be empty')
	if (page.nextCursor != null) {
		if (!/^[0-9]+:[0-9]+:[0-9]+$/.test(page.nextCursor))
			throw new Error('Starkscan_Rest: malformed event cursor')
		if (page.nextCursor === cursor)
			throw new Error('Starkscan_Rest: event cursor did not advance')
	}
	return page
}
