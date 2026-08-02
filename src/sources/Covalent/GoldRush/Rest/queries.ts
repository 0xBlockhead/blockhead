import bindings from '$/sources/Covalent/bindings.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type {
	GoldRushAddressTransactionsResponse,
	GoldRushTransactionExpansions,
	GoldRushTransactionResponse,
	GoldRushTokenBalancesResponse,
} from '$/sources/Covalent/GoldRush/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.GoldRushFoundational_Rest][0]

const evmAddressPattern = /^0x[0-9a-f]{40}$/i
const unsignedIntegerPattern = /^(0|[1-9][0-9]*)$/

const goldRushBaseUrl = (
	chainId: number
) => {
	if (
		!Number.isSafeInteger(chainId)
		|| chainId < 1
	)
		throw new Error(`GoldRushFoundational_Rest: unsupported chain ${String(chainId)}`)

	return firstHttpUrlForBinding(binding)
}

export const getTransaction = async ({
	chainId,
	chainName,
	txHash,
	expansions,
}: {
	chainId: number
	chainName: string
	txHash: string
	expansions?: GoldRushTransactionExpansions
}) => {
	if (chainName.trim() === '')
		throw new Error('GoldRushFoundational_Rest: unsupported chain')

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
	if (envelope.data.items.length === 0)
		throw new Error('GoldRushFoundational_Rest: transaction not found')
	if (envelope.data.items.length !== 1)
		throw new Error('GoldRushFoundational_Rest: transaction response is ambiguous')
	if (envelope.data.chain_id !== chainId || envelope.data.chain_name !== chainName)
		throw new Error('GoldRushFoundational_Rest: response chain does not match request')
	if (envelope.data.items[0].tx_hash.toLowerCase() !== txHash.toLowerCase())
		throw new Error('GoldRushFoundational_Rest: response transaction does not match request')

	return envelope.data
}

export const getTokenBalances = async ({
	chainId,
	chainName,
	address,
	noSpam = true,
}: {
	chainId: number
	chainName: string
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
		|| envelope.data.items.length > 5_000
	)
		throw new Error('GoldRushFoundational_Rest: invalid balance snapshot provenance')

	const balanceIdentities = new Set<string>()

	for (const balance of envelope.data.items) {
		if (
			!evmAddressPattern.test(balance.contract_address)
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
	chainName,
	address,
	page,
	noLogs = false,
	ascending = false,
}: {
	chainId: number
	chainName: string
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
		if (
			!/^0x[0-9a-f]{64}$/i.test(transaction.tx_hash)
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
		)
			throw new Error('GoldRushFoundational_Rest: invalid account transaction')

		const transactionHash = transaction.tx_hash.toLowerCase()

		if (transactionHashes.has(transactionHash))
			throw new Error('GoldRushFoundational_Rest: duplicate account transactions')

		transactionHashes.add(transactionHash)
	}

	return envelope.data
}
