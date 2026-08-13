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
	aptosWriteSetChangeWire,
	type AptosAccount,
	type AptosBlock,
	type AptosEvent,
	type AptosLedgerInfo,
	type AptosMoveModule,
	type AptosMoveResource,
	type AptosTableItemRequest,
	type AptosTransaction,
} from '$/sources/AptosFullnode/Rest/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

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

const assertTransactionEffects = (transaction: AptosTransaction) => {
	if (transaction.type === 'pending_transaction')
		return

	for (const change of transaction.changes)
		assertEnvelope('transaction state change', aptosWriteSetChangeWire, change)
	if ('events' in transaction)
		for (const event of transaction.events)
			assertEnvelope('transaction event', aptosEventWire, event)
}

const request = async (
	binding: SourceBinding,
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

const ledgerVersionQuery = (ledgerVersion?: bigint) => {
	if (ledgerVersion == null)
		return ''
	if (ledgerVersion < 0n)
		throw new Error('AptosFullnode_Rest: ledger version must not be negative')
	return `?ledger_version=${ledgerVersion.toString()}`
}

export const getLedgerInfo = async (binding: SourceBinding) => {
	const response = await request(binding)
	return {
		body: assertEnvelope('ledger info', aptosLedgerInfoWire, response.body) as AptosLedgerInfo,
		metadata: response.metadata,
	}
}

export const getAccount = async (
	binding: SourceBinding,
	address: string,
	ledgerVersion?: bigint
) => {
	if (address.length === 0)
		throw new Error('AptosFullnode_Rest: account address must not be empty')

	const response = await request(
		binding,
		`accounts/${encodeURIComponent(address)}${ledgerVersionQuery(ledgerVersion)}`
	)
	return {
		body: assertEnvelope('account', aptosAccountWire, response.body),
		metadata: response.metadata,
	}
}

export const getAccountResources = async (
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
	if (ledgerVersion != null && ledgerVersion < 0n)
		throw new Error('AptosFullnode_Rest: ledger version must not be negative')
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
		binding,
		`accounts/${encodeURIComponent(address)}/resources${parameters.size === 0 ? '' : `?${parameters.toString()}`}`
	)
	if (!Array.isArray(response.body))
		throw new Error('AptosFullnode_Rest: invalid account resources response envelope')
	if (start != null && response.metadata.cursor === start)
		throw new Error('AptosFullnode_Rest: resource cursor did not advance')

	const resources = response.body.map((resource) => (
		assertEnvelope('account resource', aptosMoveResourceWire, resource)
	)) as AptosMoveResource[]
	const resourceTypes = new Set<string>()
	for (const resource of resources) {
		if (resourceTypes.has(resource.type))
			throw new Error('AptosFullnode_Rest: duplicate account resource type')
		resourceTypes.add(resource.type)
	}
	return {
		body: resources,
		metadata: response.metadata,
	}
}

export const getAccountModules = async (
	binding: SourceBinding,
	address: string,
	ledgerVersion?: bigint
) => {
	if (address.length === 0)
		throw new Error('AptosFullnode_Rest: account address must not be empty')

	const response = await request(
		binding,
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
	binding: SourceBinding,
	address: string,
	moduleName: string,
	ledgerVersion?: bigint
) => {
	if (address.length === 0)
		throw new Error('AptosFullnode_Rest: account address must not be empty')
	if (moduleName.length === 0)
		throw new Error('AptosFullnode_Rest: module name must not be empty')

	const response = await request(
		binding,
		`accounts/${encodeURIComponent(address)}/module/${encodeURIComponent(moduleName)}${ledgerVersionQuery(ledgerVersion)}`
	)
	return {
		body: assertEnvelope('account module', aptosMoveModuleBytecodeWire, response.body) as AptosMoveModule,
		metadata: response.metadata,
	}
}

export const getBlockByHeight = async (
	binding: SourceBinding,
	height: bigint,
	withTransactions = true
) => {
	const response = await request(binding, `blocks/by_height/${height.toString()}?with_transactions=${String(withTransactions)}`)
	const block = assertEnvelope('block', aptosBlockWire, response.body) as AptosBlock
	if (block.block_height !== height.toString())
		throw new Error('AptosFullnode_Rest: block height response does not match request')
	return {
		body: block,
		metadata: response.metadata,
	}
}

export const getBlockByVersion = async (
	binding: SourceBinding,
	version: bigint,
	withTransactions = true
) => {
	const response = await request(binding, `blocks/by_version/${version.toString()}?with_transactions=${String(withTransactions)}`)
	const block = assertEnvelope('block', aptosBlockWire, response.body) as AptosBlock
	if (BigInt(block.first_version) > version || BigInt(block.last_version) < version)
		throw new Error('AptosFullnode_Rest: block version response does not contain request')
	return {
		body: block,
		metadata: response.metadata,
	}
}

export const getEventsByEventHandle = async (
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

	const response = await request(
		binding,
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
	binding: SourceBinding,
	tableHandle: string,
	requestBody: AptosTableItemRequest,
	ledgerVersion?: bigint
) => {
	if (tableHandle.length === 0)
		throw new Error('AptosFullnode_Rest: table handle must not be empty')

	const body = assertEnvelope('table item request', aptosTableItemRequestWire, requestBody)
	const response = await request(
		binding,
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
	binding: SourceBinding,
	hash: string
) => {
	const response = await request(binding, `transactions/by_hash/${encodeURIComponent(hash)}`)
	const transaction = assertEnvelope('transaction', aptosTransactionWire, response.body) as AptosTransaction
	if (transaction.hash.toLowerCase() !== hash.toLowerCase())
		throw new Error('AptosFullnode_Rest: transaction hash response does not match request')
	assertTransactionEffects(transaction)
	return {
		body: transaction,
		metadata: response.metadata,
	}
}

export const getTransactionByVersion = async (
	binding: SourceBinding,
	version: bigint
) => {
	const response = await request(binding, `transactions/by_version/${version.toString()}`)
	const transaction = assertEnvelope('transaction', aptosTransactionWire, response.body) as AptosTransaction
	if (transaction.version !== version.toString())
		throw new Error('AptosFullnode_Rest: transaction version response does not match request')
	assertTransactionEffects(transaction)
	return {
		body: transaction,
		metadata: response.metadata,
	}
}
