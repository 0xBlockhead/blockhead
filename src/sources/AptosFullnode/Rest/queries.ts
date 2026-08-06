import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import {
	aptosAccountWire,
	aptosBlockWire,
	aptosEventWire,
	aptosLedgerInfoWire,
	aptosMoveModuleBytecodeWire,
	aptosMoveResourceWire,
	aptosTableItemRequestWire,
	aptosTableItemValueWire,
	aptosTransactionWire,
	type AptosAccount,
	type AptosBlock,
	type AptosEvent,
	type AptosLedgerInfo,
	type AptosMoveModule,
	type AptosMoveResource,
	type AptosTableItemRequest,
	type AptosTransaction,
} from '$/sources/AptosFullnode/Rest/types.ts'
import bindings from '$/sources/AptosFullnode/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.AptosFullnode_Rest][0]

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

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`AptosFullnode_Rest: invalid ${label} response envelope`)
	}
}

const request = async (
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
		body: await response.json(),
		metadata,
	}
}

const ledgerVersionQuery = (ledgerVersion?: bigint) => (
	ledgerVersion == null ? '' : `?ledger_version=${ledgerVersion.toString()}`
)

export const getLedgerInfo = async () => {
	const response = await request()
	return {
		body: assertEnvelope('ledger info', aptosLedgerInfoWire, response.body) as AptosLedgerInfo,
		metadata: response.metadata,
	}
}

export const getAccount = async (
	address: string,
	ledgerVersion?: bigint
) => {
	if (address.length === 0)
		throw new Error('AptosFullnode_Rest: account address must not be empty')

	const response = await request(
		`accounts/${encodeURIComponent(address)}${ledgerVersionQuery(ledgerVersion)}`
	)
	return {
		body: assertEnvelope('account', aptosAccountWire, response.body) as AptosAccount,
		metadata: response.metadata,
	}
}

export const getAccountResources = async (
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

	const response = await request(
		`accounts/${encodeURIComponent(address)}/resources${parameters.size === 0 ? '' : `?${parameters.toString()}`}`
	)
	if (!Array.isArray(response.body))
		throw new Error('AptosFullnode_Rest: invalid account resources response envelope')
	if (start != null && response.metadata.cursor === start)
		throw new Error('AptosFullnode_Rest: resource cursor did not advance')

	return {
		body: response.body.map((resource) => (
			assertEnvelope('account resource', aptosMoveResourceWire, resource)
		)) as AptosMoveResource[],
		metadata: response.metadata,
	}
}

export const getAccountModules = async (
	address: string,
	ledgerVersion?: bigint
) => {
	if (address.length === 0)
		throw new Error('AptosFullnode_Rest: account address must not be empty')

	const response = await request(
		`accounts/${encodeURIComponent(address)}/modules${ledgerVersionQuery(ledgerVersion)}`
	)
	if (!Array.isArray(response.body))
		throw new Error('AptosFullnode_Rest: invalid account modules response envelope')

	return {
		body: response.body.map((module) => (
			assertEnvelope('account module', aptosMoveModuleBytecodeWire, module)
		)) as AptosMoveModule[],
		metadata: response.metadata,
	}
}

export const getAccountModule = async (
	address: string,
	moduleName: string,
	ledgerVersion?: bigint
) => {
	if (address.length === 0)
		throw new Error('AptosFullnode_Rest: account address must not be empty')
	if (moduleName.length === 0)
		throw new Error('AptosFullnode_Rest: module name must not be empty')

	const response = await request(
		`accounts/${encodeURIComponent(address)}/module/${encodeURIComponent(moduleName)}${ledgerVersionQuery(ledgerVersion)}`
	)
	return {
		body: assertEnvelope('account module', aptosMoveModuleBytecodeWire, response.body) as AptosMoveModule,
		metadata: response.metadata,
	}
}

export const getBlockByHeight = async (
	height: bigint,
	withTransactions = true
) => {
	const response = await request(`blocks/by_height/${height.toString()}?with_transactions=${String(withTransactions)}`)
	return {
		body: assertEnvelope('block', aptosBlockWire, response.body) as AptosBlock,
		metadata: response.metadata,
	}
}

export const getBlockByVersion = async (
	version: bigint,
	withTransactions = true
) => {
	const response = await request(`blocks/by_version/${version.toString()}?with_transactions=${String(withTransactions)}`)
	return {
		body: assertEnvelope('block', aptosBlockWire, response.body) as AptosBlock,
		metadata: response.metadata,
	}
}

export const getEventsByEventHandle = async (
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

	const response = await request(
		`accounts/${encodeURIComponent(address)}/events/${encodeURIComponent(eventHandle)}/${encodeURIComponent(fieldName)}${parameters.size === 0 ? '' : `?${parameters.toString()}`}`
	)
	if (!Array.isArray(response.body))
		throw new Error('AptosFullnode_Rest: invalid events response envelope')

	return {
		body: response.body.map((event) => (
			assertEnvelope('event', aptosEventWire, event)
		)) as AptosEvent[],
		metadata: response.metadata,
	}
}

export const getTableItem = async <_Value>(
	tableHandle: string,
	requestBody: AptosTableItemRequest,
	ledgerVersion?: bigint
) => {
	if (tableHandle.length === 0)
		throw new Error('AptosFullnode_Rest: table handle must not be empty')

	const body = assertEnvelope('table item request', aptosTableItemRequestWire, requestBody)
	const response = await request(
		`tables/${encodeURIComponent(tableHandle)}/item${ledgerVersionQuery(ledgerVersion)}`,
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
		}
	)
	return {
		body: assertEnvelope('table item value', aptosTableItemValueWire, response.body) as _Value,
		metadata: response.metadata,
	}
}

export const getTransactionByHash = async (
	hash: string
) => {
	const response = await request(`transactions/by_hash/${encodeURIComponent(hash)}`)
	return {
		body: assertEnvelope('transaction', aptosTransactionWire, response.body) as AptosTransaction,
		metadata: response.metadata,
	}
}

export const getTransactionByVersion = async (
	version: bigint
) => {
	const response = await request(`transactions/by_version/${version.toString()}`)
	return {
		body: assertEnvelope('transaction', aptosTransactionWire, response.body) as AptosTransaction,
		metadata: response.metadata,
	}
}
