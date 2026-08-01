import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type {
	AptosAccount,
	AptosBlock,
	AptosEvent,
	AptosLedgerInfo,
	AptosMoveModule,
	AptosMoveResource,
	AptosTableItemRequest,
	AptosTransaction,
} from '$/sources/AptosFullnode/Rest/types.ts'
import bindings from '$/sources/AptosFullnode/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.AptosFullnode_Rest]

const requiredHeader = (
	response: Response,
	name: string
) => {
	const value = response.headers.get(name)
	if (value == null)
		throw new Error(`Aptos Fullnode response missing ${name}`)

	return value
}

const assertNonnegativeIntegerString = (
	value: string,
	label: string
) => {
	try {
		if (BigInt(value) < 0n)
			throw new Error()
	} catch {
		throw new Error(`AptosFullnode_Rest: invalid ${label}`)
	}
}

const request = async <_Body>(
	path = '',
	init?: RequestInit
) => {
	const response = await sourceFetch(
		binding,
		new URL(path, firstHttpUrlForBinding(binding)).toString(),
		init
	)
	if (!response.ok)
		await throwHttpError(`${binding.source} ${path}`, response)

	const metadata = {
		chainId: requiredHeader(response, 'x-aptos-chain-id'),
		ledgerVersion: requiredHeader(response, 'x-aptos-ledger-version'),
		oldestLedgerVersion: requiredHeader(response, 'x-aptos-ledger-oldest-version'),
		ledgerTimestampUsec: requiredHeader(response, 'x-aptos-ledger-timestampusec'),
		epoch: requiredHeader(response, 'x-aptos-epoch'),
		blockHeight: requiredHeader(response, 'x-aptos-block-height'),
		oldestBlockHeight: requiredHeader(response, 'x-aptos-oldest-block-height'),
		...(response.headers.has('x-aptos-gas-used') && {
			gasUsed: requiredHeader(response, 'x-aptos-gas-used'),
		}),
		...(response.headers.has('x-aptos-cursor') && {
			cursor: requiredHeader(response, 'x-aptos-cursor'),
		}),
	}
	if (metadata.chainId !== '1')
		throw new Error('AptosFullnode_Rest: response chain ID does not match Aptos mainnet')
	assertNonnegativeIntegerString(metadata.ledgerVersion, 'ledger version')
	assertNonnegativeIntegerString(metadata.oldestLedgerVersion, 'oldest ledger version')
	assertNonnegativeIntegerString(metadata.ledgerTimestampUsec, 'ledger timestamp')
	assertNonnegativeIntegerString(metadata.epoch, 'epoch')
	assertNonnegativeIntegerString(metadata.blockHeight, 'block height')
	assertNonnegativeIntegerString(metadata.oldestBlockHeight, 'oldest block height')
	if (metadata.cursor === '')
		throw new Error('AptosFullnode_Rest: empty pagination cursor')

	return {
		body: await response.json<_Body>(),
		metadata,
	}
}

const ledgerVersionQuery = (ledgerVersion?: bigint) => (
	ledgerVersion == null ? '' : `?ledger_version=${ledgerVersion.toString()}`
)

export const getLedgerInfo = () => (
	request<AptosLedgerInfo>()
)

export const getAccount = (
	address: string,
	ledgerVersion?: bigint
) => {
	if (address.length === 0)
		throw new Error('AptosFullnode_Rest: account address must not be empty')

	return request<AptosAccount>(
		`accounts/${encodeURIComponent(address)}${ledgerVersionQuery(ledgerVersion)}`
	)
}

export const getAccountResources = (
	address: string,
	ledgerVersion?: bigint,
	start?: string,
	limit?: number
) => {
	if (address.length === 0)
		throw new Error('AptosFullnode_Rest: account address must not be empty')
	if (start === '')
		throw new Error('AptosFullnode_Rest: resource cursor must not be empty')
	if (limit != null && (!Number.isSafeInteger(limit) || limit < 1 || limit > 1_000))
		throw new Error('AptosFullnode_Rest: resource limit must be an integer from 1 through 1000')

	const parameters = new URLSearchParams()
	if (ledgerVersion != null)
		parameters.set('ledger_version', ledgerVersion.toString())
	if (start != null)
		parameters.set('start', start)
	if (limit != null)
		parameters.set('limit', limit.toString())

	return request<AptosMoveResource[]>(
		`accounts/${encodeURIComponent(address)}/resources${parameters.size === 0 ? '' : `?${parameters.toString()}`}`
	).then((response) => {
		if (start != null && response.metadata.cursor === start)
			throw new Error('AptosFullnode_Rest: resource cursor did not advance')
		return response
	})
}

export const getAccountModules = (
	address: string,
	ledgerVersion?: bigint
) => (
	request<AptosMoveModule[]>(`accounts/${encodeURIComponent(address)}/modules${ledgerVersionQuery(ledgerVersion)}`)
)

export const getBlockByHeight = (
	height: bigint,
	withTransactions = true
) => (
	request<AptosBlock>(`blocks/by_height/${height.toString()}?with_transactions=${String(withTransactions)}`)
)

export const getBlockByVersion = (
	version: bigint,
	withTransactions = true
) => (
	request<AptosBlock>(`blocks/by_version/${version.toString()}?with_transactions=${String(withTransactions)}`)
)

export const getEventsByEventHandle = (
	address: string,
	eventHandle: string,
	fieldName: string,
	start?: bigint,
	limit?: number
) => {
	const parameters = new URLSearchParams()
	if (start != null)
		parameters.set('start', start.toString())
	if (limit != null)
		parameters.set('limit', String(limit))

	return request<AptosEvent[]>(
		`accounts/${encodeURIComponent(address)}/events/${encodeURIComponent(eventHandle)}/${encodeURIComponent(fieldName)}${parameters.size === 0 ? '' : `?${parameters.toString()}`}`
	)
}

export const getTableItem = <_Value>(
	tableHandle: string,
	requestBody: AptosTableItemRequest,
	ledgerVersion?: bigint
) => (
	request<_Value>(
		`tables/${encodeURIComponent(tableHandle)}/item${ledgerVersionQuery(ledgerVersion)}`,
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		}
	)
)

export const getTransactionByHash = (
	hash: string
) => (
	request<AptosTransaction>(`transactions/by_hash/${encodeURIComponent(hash)}`)
)

export const getTransactionByVersion = (
	version: bigint
) => (
	request<AptosTransaction>(`transactions/by_version/${version.toString()}`)
)
