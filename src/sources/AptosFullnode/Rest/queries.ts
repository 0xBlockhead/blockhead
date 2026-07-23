import { throwHttpError } from '$/lib/http.ts'
import { firstHttpUrlForBinding, sourceFetch } from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import type {
	AptosAccount,
	AptosBlock,
	AptosEvent,
	AptosLedgerInfo,
	AptosMoveModule,
	AptosMoveResource,
	AptosResponse,
	AptosTableItemRequest,
	AptosTransaction,
} from '$/sources/AptosFullnode/Rest/types.ts'

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

const assertMainnetBinding = (binding: SourceBinding) => {
	if (
		binding.source !== Source.AptosFullnode_Rest
		|| binding.target.kind !== SourceTargetKind.Caip2Network
		|| binding.target.key !== 'aptos:1'
	)
		throw new Error('AptosFullnode_Rest: expected canonical Aptos mainnet binding')
}

const request = async <_Body>(
	binding: SourceBinding,
	path = '',
	init?: RequestInit
): Promise<AptosResponse<_Body>> => {
	assertMainnetBinding(binding)
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
		body: await response.json(),
		metadata,
	}
}

const ledgerVersionQuery = (ledgerVersion?: bigint) => (
	ledgerVersion == null ? '' : `?ledger_version=${ledgerVersion.toString()}`
)

export const getLedgerInfo = (binding: SourceBinding) => (
	request<AptosLedgerInfo>(binding)
)

export const getAccount = (
	binding: SourceBinding,
	address: string,
	ledgerVersion?: bigint
) => {
	if (address.length === 0)
		throw new Error('AptosFullnode_Rest: account address must not be empty')

	return request<AptosAccount>(
		binding,
		`accounts/${encodeURIComponent(address)}${ledgerVersionQuery(ledgerVersion)}`
	)
}

export const getAccountResources = (
	binding: SourceBinding,
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
		binding,
		`accounts/${encodeURIComponent(address)}/resources${parameters.size === 0 ? '' : `?${parameters.toString()}`}`
	).then((response) => {
		if (start != null && response.metadata.cursor === start)
			throw new Error('AptosFullnode_Rest: resource cursor did not advance')
		return response
	})
}

export const getAccountModules = (
	binding: SourceBinding,
	address: string,
	ledgerVersion?: bigint
) => (
	request<AptosMoveModule[]>(binding, `accounts/${encodeURIComponent(address)}/modules${ledgerVersionQuery(ledgerVersion)}`)
)

export const getBlockByHeight = (
	binding: SourceBinding,
	height: bigint,
	withTransactions = true
) => (
	request<AptosBlock>(binding, `blocks/by_height/${height.toString()}?with_transactions=${String(withTransactions)}`)
)

export const getBlockByVersion = (
	binding: SourceBinding,
	version: bigint,
	withTransactions = true
) => (
	request<AptosBlock>(binding, `blocks/by_version/${version.toString()}?with_transactions=${String(withTransactions)}`)
)

export const getEventsByEventHandle = (
	binding: SourceBinding,
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
		binding,
		`accounts/${encodeURIComponent(address)}/events/${encodeURIComponent(eventHandle)}/${encodeURIComponent(fieldName)}${parameters.size === 0 ? '' : `?${parameters.toString()}`}`
	)
}

export const getTableItem = <_Value>(
	binding: SourceBinding,
	tableHandle: string,
	requestBody: AptosTableItemRequest,
	ledgerVersion?: bigint
) => (
	request<_Value>(
		binding,
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
	binding: SourceBinding,
	hash: string
) => (
	request<AptosTransaction>(binding, `transactions/by_hash/${encodeURIComponent(hash)}`)
)

export const getTransactionByVersion = (
	binding: SourceBinding,
	version: bigint
) => (
	request<AptosTransaction>(binding, `transactions/by_version/${version.toString()}`)
)
