import bindings from '$/sources/Covalent/bindings.ts'
import { goldRushChainNameByChainId } from '$/sources/Covalent/GoldRush/Rest/constants.ts'
import {
	goldRushAddressTransactionsResponseWire,
	goldRushTokenBalancesResponseWire,
	goldRushTransactionResponseWire,
	type GoldRushTransactionExpansions,
	type GoldRushTransactionItem,
} from '$/sources/Covalent/GoldRush/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'

const binding = bindings[Source.GoldRushFoundational_Rest][0]

const evmAddressPattern = /^0x[0-9a-f]{40}$/i
const evmTransactionHashPattern = /^0x[0-9a-f]{64}$/i

const assertEnvelope = <_Value>(
	label: string,
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`GoldRushFoundational_Rest: invalid ${label} response envelope`)
	}
}

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

const assertFiniteIso = (
	value: string,
	label: string
) => {
	if (!Number.isFinite(Date.parse(value)))
		throw new Error(`GoldRushFoundational_Rest: invalid ${label}`)
}

const assertGoldRushTransactionBusinessRules = (
	transaction: GoldRushTransactionItem,
	{
		requireLogs = false,
		expansions,
	}: {
		requireLogs?: boolean
		expansions?: GoldRushTransactionExpansions
	} = {}
) => {
	assertFiniteIso(transaction.block_signed_at, 'transaction block_signed_at')

	for (const log of transaction.log_events) {
		assertFiniteIso(log.block_signed_at, 'transaction log block_signed_at')
		if (log.tx_hash.toLowerCase() !== transaction.tx_hash.toLowerCase())
			throw new Error('GoldRushFoundational_Rest: invalid transaction log event')
	}

	if (
		requireLogs
		|| transaction.log_events.length > 0
	) {
		const logOffsets = new Set<number>()

		for (const log of transaction.log_events) {
			if (logOffsets.has(log.log_offset))
				throw new Error('GoldRushFoundational_Rest: duplicate transaction log events')

			logOffsets.add(log.log_offset)
		}
	}

	if (expansions?.withInternal === true && transaction.internal_transfers == null)
		throw new Error('GoldRushFoundational_Rest: internal transfers missing')

	if (expansions?.withState === true && transaction.state_changes == null)
		throw new Error('GoldRushFoundational_Rest: state changes missing')

	if (
		expansions?.withInputData === true
		&& transaction.input_data == null
	)
		throw new Error('GoldRushFoundational_Rest: input data missing')
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

	const envelope = assertEnvelope(
		'transaction',
		goldRushTransactionResponseWire,
		await sourceGetJson<unknown>(
			binding,
			url.toString()
		)
	)
	if (envelope.error)
		throw new Error(
			`GoldRushFoundational_Rest: ${envelope.error_message ?? `API error ${String(envelope.error_code)}`}`
		)
	if (envelope.data == null)
		throw new Error('GoldRushFoundational_Rest: response data is missing')
	assertFiniteIso(envelope.data.updated_at, 'transaction provenance')
	if (envelope.data.items.length === 0)
		throw new Error('GoldRushFoundational_Rest: transaction not found')
	if (envelope.data.items.length !== 1)
		throw new Error('GoldRushFoundational_Rest: transaction response is ambiguous')
	if (envelope.data.chain_id !== chainId || envelope.data.chain_name !== chainName)
		throw new Error('GoldRushFoundational_Rest: response chain does not match request')
	if (envelope.data.items[0].tx_hash.toLowerCase() !== txHash.toLowerCase())
		throw new Error('GoldRushFoundational_Rest: response transaction does not match request')

	assertGoldRushTransactionBusinessRules(envelope.data.items[0], {
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

	const envelope = assertEnvelope(
		'token balances',
		goldRushTokenBalancesResponseWire,
		await sourceGetJson<unknown>(
			binding,
			url.toString()
		)
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

	assertFiniteIso(envelope.data.chain_tip_signed_at, 'balance snapshot provenance')
	assertFiniteIso(envelope.data.updated_at, 'balance snapshot provenance')
	if (envelope.data.quote_currency.trim() === '')
		throw new Error('GoldRushFoundational_Rest: invalid balance snapshot provenance')

	const balanceIdentities = new Set<string>()

	for (const balance of envelope.data.items) {
		if (
			balance.last_transferred_at != null
			&& !Number.isFinite(Date.parse(balance.last_transferred_at))
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

	const envelope = assertEnvelope(
		'address transactions',
		goldRushAddressTransactionsResponseWire,
		await sourceGetJson<unknown>(
			binding,
			url.toString()
		)
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

	assertFiniteIso(envelope.data.chain_tip_signed_at, 'transaction page provenance')
	assertFiniteIso(envelope.data.updated_at, 'transaction page provenance')
	if (envelope.data.quote_currency.trim() === '')
		throw new Error('GoldRushFoundational_Rest: invalid transaction page provenance')

	const transactionHashes = new Set<string>()

	for (const transaction of envelope.data.items) {
		assertGoldRushTransactionBusinessRules(transaction, {
			requireLogs: !noLogs,
		})

		const transactionHash = transaction.tx_hash.toLowerCase()

		if (transactionHashes.has(transactionHash))
			throw new Error('GoldRushFoundational_Rest: duplicate account transactions')

		transactionHashes.add(transactionHash)
	}

	return envelope.data
}
