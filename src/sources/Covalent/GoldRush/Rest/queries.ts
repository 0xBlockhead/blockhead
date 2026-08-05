import bindings from '$/sources/Covalent/bindings.ts'
import { goldRushChainNameByChainId } from '$/sources/Covalent/GoldRush/Rest/constants.ts'
import type {
	GoldRushAddressTransactionsResponse,
	GoldRushInternalTransfer,
	GoldRushLogEvent,
	GoldRushStateChange,
	GoldRushTransactionExpansions,
	GoldRushTransactionItem,
	GoldRushTransactionResponse,
	GoldRushTokenBalancesResponse,
} from '$/sources/Covalent/GoldRush/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'

const binding = bindings[Source.GoldRushFoundational_Rest][0]

const evmAddressPattern = /^0x[0-9a-f]{40}$/i
const evmTransactionHashPattern = /^0x[0-9a-f]{64}$/i
const unsignedIntegerPattern = /^(0|[1-9][0-9]*)$/

export const goldRushChainName = (
	chainId: number
) => {
	if (
		!Number.isSafeInteger(chainId)
		|| chainId < 1
	)
		throw new Error(`GoldRushFoundational_Rest: unsupported chain ${String(chainId)}`)

	const chainName = goldRushChainNameByChainId[chainId]
	if (chainName == null)
		throw new Error(`GoldRushFoundational_Rest: unsupported chain ${String(chainId)}`)

	return chainName
}

const goldRushBaseUrl = (
	chainId: number
) => {
	goldRushChainName(chainId)
	return firstHttpUrlForBinding(binding)
}

const assertGoldRushLogEvent = (
	log: GoldRushLogEvent,
	txHash: string
) => {
	if (
		!Number.isFinite(Date.parse(log.block_signed_at))
		|| !Number.isSafeInteger(log.block_height)
		|| log.block_height < 0
		|| !Number.isSafeInteger(log.tx_offset)
		|| log.tx_offset < 0
		|| !Number.isSafeInteger(log.log_offset)
		|| log.log_offset < 0
		|| !evmTransactionHashPattern.test(log.tx_hash)
		|| log.tx_hash.toLowerCase() !== txHash.toLowerCase()
		|| !evmAddressPattern.test(log.sender_address)
		|| log.raw_log_topics.length === 0
		|| log.raw_log_topics.some((topic) => !/^0x[0-9a-f]{64}$/i.test(topic))
		|| (
			log.raw_log_data !== null
			&& !/^0x([0-9a-f]{2})*$/i.test(log.raw_log_data)
		)
	)
		throw new Error('GoldRushFoundational_Rest: invalid transaction log event')
}

const assertGoldRushInternalTransfer = (
	transfer: GoldRushInternalTransfer
) => {
	if (
		!evmAddressPattern.test(transfer.from_address)
		|| (
			transfer.to_address !== null
			&& !evmAddressPattern.test(transfer.to_address)
		)
		|| !unsignedIntegerPattern.test(transfer.value)
		|| !Number.isSafeInteger(transfer.gas_limit)
		|| transfer.gas_limit < 0
	)
		throw new Error('GoldRushFoundational_Rest: invalid internal transfer')
}

const assertGoldRushStateChange = (
	change: GoldRushStateChange
) => {
	if (
		!evmAddressPattern.test(change.address)
		|| !unsignedIntegerPattern.test(change.balance_before)
		|| !unsignedIntegerPattern.test(change.balance_after)
		|| !Number.isSafeInteger(change.nonce_before)
		|| change.nonce_before < 0
		|| !Number.isSafeInteger(change.nonce_after)
		|| change.nonce_after < 0
		|| change.storage_changes.some((storage) => (
			storage.storage_address.trim() === ''
			|| storage.value_before.trim() === ''
			|| storage.value_after.trim() === ''
		))
	)
		throw new Error('GoldRushFoundational_Rest: invalid state change')
}

const assertGoldRushTransactionItem = (
	transaction: GoldRushTransactionItem,
	{
		requireLogs = false,
		expansions,
	}: {
		requireLogs?: boolean
		expansions?: GoldRushTransactionExpansions
	} = {}
) => {
	if (
		!evmTransactionHashPattern.test(transaction.tx_hash)
		|| !evmAddressPattern.test(transaction.from_address)
		|| (
			transaction.to_address !== null
			&& !evmAddressPattern.test(transaction.to_address)
		)
		|| !unsignedIntegerPattern.test(transaction.value)
		|| !Number.isSafeInteger(transaction.block_height)
		|| transaction.block_height < 0
		|| !Number.isSafeInteger(transaction.tx_offset)
		|| transaction.tx_offset < 0
		|| !Number.isFinite(Date.parse(transaction.block_signed_at))
		|| !/^0x[0-9a-f]{64}$/i.test(transaction.block_hash)
		|| !Number.isSafeInteger(transaction.gas_offered)
		|| transaction.gas_offered < 0
		|| !Number.isSafeInteger(transaction.gas_spent)
		|| transaction.gas_spent < 0
		|| !Number.isSafeInteger(transaction.gas_price)
		|| transaction.gas_price < 0
		|| (
			transaction.successful !== true
			&& transaction.successful !== false
		)
	)
		throw new Error('GoldRushFoundational_Rest: invalid account transaction')

	if (
		requireLogs
		|| transaction.log_events.length > 0
	) {
		const logOffsets = new Set<number>()

		for (const log of transaction.log_events) {
			assertGoldRushLogEvent(log, transaction.tx_hash)

			if (logOffsets.has(log.log_offset))
				throw new Error('GoldRushFoundational_Rest: duplicate transaction log events')

			logOffsets.add(log.log_offset)
		}
	}

	if (expansions?.withInternal === true) {
		if (transaction.internal_transfers == null)
			throw new Error('GoldRushFoundational_Rest: internal transfers missing')

		for (const transfer of transaction.internal_transfers)
			assertGoldRushInternalTransfer(transfer)
	} else if (transaction.internal_transfers != null) {
		for (const transfer of transaction.internal_transfers)
			assertGoldRushInternalTransfer(transfer)
	}

	if (expansions?.withState === true) {
		if (transaction.state_changes == null)
			throw new Error('GoldRushFoundational_Rest: state changes missing')

		for (const change of transaction.state_changes)
			assertGoldRushStateChange(change)
	} else if (transaction.state_changes != null) {
		for (const change of transaction.state_changes)
			assertGoldRushStateChange(change)
	}

	if (expansions?.withInputData === true) {
		if (
			transaction.input_data == null
			|| !/^0x[0-9a-f]*$/i.test(transaction.input_data.method_id)
		)
			throw new Error('GoldRushFoundational_Rest: input data missing')
	} else if (
		transaction.input_data != null
		&& !/^0x[0-9a-f]*$/i.test(transaction.input_data.method_id)
	)
		throw new Error('GoldRushFoundational_Rest: invalid input data')
}

export const getTransaction = async ({
	chainId,
	chainName = goldRushChainName(chainId),
	txHash,
	expansions,
}: {
	chainId: number
	chainName?: string
	txHash: string
	expansions?: GoldRushTransactionExpansions
}) => {
	if (chainName.trim() === '')
		throw new Error('GoldRushFoundational_Rest: unsupported chain')

	if (!evmTransactionHashPattern.test(txHash))
		throw new Error('GoldRushFoundational_Rest: invalid transaction hash')

	const url = new URL(
		`/v1/${encodeURIComponent(chainName)}/transaction_v2/${encodeURIComponent(txHash)}/`,
		goldRushBaseUrl(
			chainId
		)
	)
	if (expansions?.withInternal != null)
		url.searchParams.set('with-internal', String(expansions.withInternal))
	if (expansions?.withState != null)
		url.searchParams.set('with-state', String(expansions.withState))
	if (expansions?.withInputData != null)
		url.searchParams.set('with-input-data', String(expansions.withInputData))

	const envelope = await sourceGetJson<GoldRushTransactionResponse>(
		binding,
		url.toString()
	)
	if (envelope.error)
		throw new Error(
			`GoldRushFoundational_Rest: ${envelope.error_message ?? `API error ${String(envelope.error_code)}`}`
		)
	if (envelope.data == null)
		throw new Error('GoldRushFoundational_Rest: response data is missing')
	if (!Number.isFinite(Date.parse(envelope.data.updated_at)))
		throw new Error('GoldRushFoundational_Rest: invalid transaction provenance')
	if (envelope.data.items.length === 0)
		throw new Error('GoldRushFoundational_Rest: transaction not found')
	if (envelope.data.items.length !== 1)
		throw new Error('GoldRushFoundational_Rest: transaction response is ambiguous')
	if (envelope.data.chain_id !== chainId || envelope.data.chain_name !== chainName)
		throw new Error('GoldRushFoundational_Rest: response chain does not match request')
	if (envelope.data.items[0].tx_hash.toLowerCase() !== txHash.toLowerCase())
		throw new Error('GoldRushFoundational_Rest: response transaction does not match request')

	assertGoldRushTransactionItem(envelope.data.items[0], {
		requireLogs: true,
		expansions,
	})

	return envelope.data
}

export const getTokenBalances = async ({
	chainId,
	chainName = goldRushChainName(chainId),
	address,
	noSpam = true,
}: {
	chainId: number
	chainName?: string
	address: string
	noSpam?: boolean
}) => {
	if (chainName.trim() === '')
		throw new Error('GoldRushFoundational_Rest: unsupported chain')

	if (!evmAddressPattern.test(address))
		throw new Error('GoldRushFoundational_Rest: invalid account address')

	const url = new URL(
		`/v1/${encodeURIComponent(chainName)}/address/${encodeURIComponent(address)}/balances_v2/`,
		goldRushBaseUrl(
			chainId
		)
	)

	url.searchParams.set('no-spam', String(noSpam))

	const envelope = await sourceGetJson<GoldRushTokenBalancesResponse>(
		binding,
		url.toString()
	)

	if (envelope.error)
		throw new Error(
			`GoldRushFoundational_Rest: ${envelope.error_message ?? `API error ${String(envelope.error_code)}`}`
		)

	if (envelope.data == null)
		throw new Error('GoldRushFoundational_Rest: response data is missing')

	if (
		envelope.data.chain_id !== chainId
		|| envelope.data.chain_name !== chainName
		|| envelope.data.address.toLowerCase() !== address.toLowerCase()
	)
		throw new Error('GoldRushFoundational_Rest: response account identity does not match request')

	if (
		!Number.isSafeInteger(envelope.data.chain_tip_height)
		|| envelope.data.chain_tip_height < 0
		|| !Number.isFinite(Date.parse(envelope.data.chain_tip_signed_at))
		|| !Number.isFinite(Date.parse(envelope.data.updated_at))
		|| envelope.data.quote_currency.trim() === ''
		|| envelope.data.items.length > 5_000
	)
		throw new Error('GoldRushFoundational_Rest: invalid balance snapshot provenance')

	const balanceIdentities = new Set<string>()

	for (const balance of envelope.data.items) {
		if (
			!evmAddressPattern.test(balance.contract_address)
			|| balance.contract_ticker_symbol.trim() === ''
			|| !Number.isSafeInteger(balance.contract_decimals)
			|| balance.contract_decimals < 0
			|| balance.contract_decimals > 255
			|| !Number.isSafeInteger(balance.block_height)
			|| balance.block_height < 0
			|| !unsignedIntegerPattern.test(balance.balance)
			|| (
				balance.balance_24h !== null
				&& !unsignedIntegerPattern.test(balance.balance_24h)
			)
			|| (
				balance.last_transferred_at !== null
				&& !Number.isFinite(Date.parse(balance.last_transferred_at))
			)
			|| (
				balance.is_native_token !== true
				&& balance.is_native_token !== false
			)
			|| (
				balance.is_spam !== true
				&& balance.is_spam !== false
			)
		)
			throw new Error('GoldRushFoundational_Rest: invalid token balance')

		const balanceIdentity = `${balance.contract_address.toLowerCase()}:${balance.is_native_token ? 'native' : 'token'}`

		if (balanceIdentities.has(balanceIdentity))
			throw new Error('GoldRushFoundational_Rest: duplicate token balances')

		balanceIdentities.add(balanceIdentity)
	}

	return envelope.data
}

export const getAddressTransactions = async ({
	chainId,
	chainName = goldRushChainName(chainId),
	address,
	page,
	noLogs = false,
	ascending = false,
}: {
	chainId: number
	chainName?: string
	address: string
	page: number
	noLogs?: boolean
	ascending?: boolean
}) => {
	if (chainName.trim() === '')
		throw new Error('GoldRushFoundational_Rest: unsupported chain')

	if (!evmAddressPattern.test(address))
		throw new Error('GoldRushFoundational_Rest: invalid account address')

	if (!Number.isSafeInteger(page) || page < 0)
		throw new Error('GoldRushFoundational_Rest: page must be a nonnegative safe integer')

	const url = new URL(
		`/v1/${encodeURIComponent(chainName)}/address/${encodeURIComponent(address)}/transactions_v3/page/${String(page)}/`,
		goldRushBaseUrl(
			chainId
		)
	)

	url.searchParams.set('no-logs', String(noLogs))
	url.searchParams.set('block-signed-at-asc', String(ascending))

	const envelope = await sourceGetJson<GoldRushAddressTransactionsResponse>(
		binding,
		url.toString()
	)

	if (envelope.error)
		throw new Error(
			`GoldRushFoundational_Rest: ${envelope.error_message ?? `API error ${String(envelope.error_code)}`}`
		)

	if (envelope.data == null)
		throw new Error('GoldRushFoundational_Rest: response data is missing')

	if (
		envelope.data.chain_id !== chainId
		|| envelope.data.chain_name !== chainName
		|| envelope.data.address.toLowerCase() !== address.toLowerCase()
		|| envelope.data.current_page !== page
	)
		throw new Error('GoldRushFoundational_Rest: response transaction page identity does not match request')

	if (
		!Number.isSafeInteger(envelope.data.chain_tip_height)
		|| envelope.data.chain_tip_height < 0
		|| !Number.isFinite(Date.parse(envelope.data.chain_tip_signed_at))
		|| !Number.isFinite(Date.parse(envelope.data.updated_at))
		|| envelope.data.quote_currency.trim() === ''
		|| envelope.data.items.length > 100
		|| (
			envelope.data.links.prev !== null
			&& !URL.canParse(envelope.data.links.prev)
		)
		|| (
			envelope.data.links.next !== null
			&& !URL.canParse(envelope.data.links.next)
		)
	)
		throw new Error('GoldRushFoundational_Rest: invalid transaction page provenance')

	const transactionHashes = new Set<string>()

	for (const transaction of envelope.data.items) {
		assertGoldRushTransactionItem(transaction, {
			requireLogs: !noLogs,
		})

		const transactionHash = transaction.tx_hash.toLowerCase()

		if (transactionHashes.has(transactionHash))
			throw new Error('GoldRushFoundational_Rest: duplicate account transactions')

		transactionHashes.add(transactionHash)
	}

	return envelope.data
}
