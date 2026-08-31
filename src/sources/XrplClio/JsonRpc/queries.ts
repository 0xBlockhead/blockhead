import {
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	sourceBindingId,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import bindings from '$/sources/XrplClio/bindings.ts'
import { xrplLedgerLive } from '$/sources/XrplClio/JsonRpc/live.remote.ts'
import {
	xrplClioLedger,
	xrplClioLedgerClosed,
	xrplClioLedgerData,
	xrplClioLedgerWithTransactions,
	xrplClioServerInfo,
	xrplClioTransaction,
	type XrplClioLedgerClosedResult,
	type XrplClioLedgerDataResult,
	type XrplClioLedgerResult,
	type XrplClioLedgerSpecifier,
	type XrplClioLedgerWithTransactionsResult,
	type XrplClioMarker,
	type XrplClioServerInfoResult,
	type XrplClioTransactionResult,
} from '$/sources/XrplClio/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonObject } from '$/typescript/JsonValue.ts'

const remoteQueryBinding = () => {
	const binding = bindings[Source.XrplClio_JsonRpc].find((candidate) => (
		candidate.delivery === SourceDelivery.RemoteQuery
	))
	if (binding == null)
		throw new Error('XrplClio_JsonRpc: RemoteQuery binding is missing')
	return binding
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`XrplClio_JsonRpc: invalid ${label} response envelope`)
	}
}

export const getServerInfo = async () => (
	assertEnvelope(
		'server_info',
		xrplClioServerInfo,
		await jsonRpc2<unknown>(remoteQueryBinding(), 'server_info')
	)
)

export const getLedgerClosed = async () => (
	assertEnvelope(
		'ledger_closed',
		xrplClioLedgerClosed,
		await jsonRpc2<unknown>(remoteQueryBinding(), 'ledger_closed')
	)
)

export const getClosedLedger = () => getLedgerClosed()

export const getLedger = async (
	specifier: XrplClioLedgerSpecifier | {
		ledgerHash: string
	} = 'validated'
) => {
	if (typeof specifier === 'object') {
		if (specifier.ledgerHash.length === 0)
			throw new Error('XrplClio_JsonRpc: ledger hash must not be empty')
	} else if (specifier !== 'validated') {
		if (!Number.isSafeInteger(specifier) || specifier < 0)
			throw new Error('XrplClio_JsonRpc: ledger index must be a nonnegative safe integer')
	}

	return assertEnvelope(
		'ledger',
		xrplClioLedger,
		await jsonRpc2<unknown>(remoteQueryBinding(), 'ledger', [{
			...(
				typeof specifier === 'object' ?
					{
						ledger_hash: specifier.ledgerHash,
					}
				:
					{
						ledger_index: specifier,
					}
			),
			transactions: false,
			expand: false,
		}])
	)
}

export const getValidatedLedger = async () => (
	getLedger('validated')
)

export const getRecentLedgers = async (
	limit: number
) => {
	if (!Number.isSafeInteger(limit) || limit < 1)
		throw new Error('XrplClio_JsonRpc: invalid recent ledger limit')

	const tip = await getValidatedLedger()
	if (!tip.validated)
		throw new Error('XrplClio_JsonRpc: tip ledger is not validated')

	const tipIndex = tip.ledger_index
	const count = Math.min(limit, tipIndex + 1)
	const indexes = Array.from({ length: count }, (_, offset) => tipIndex - offset)

	return Promise.all(indexes.map(async (ledgerIndex) => {
		if (ledgerIndex === tipIndex)
			return tip
		const ledger = await getLedger(ledgerIndex)
		if (!ledger.validated)
			throw new Error('XrplClio_JsonRpc: historical ledger is not validated')
		if (ledger.ledger_index !== ledgerIndex)
			throw new Error('XrplClio_JsonRpc: historical ledger index does not match')
		return ledger
	}))
}

export const getLedgerTransactions = async (
	specifier: XrplClioLedgerSpecifier | {
		ledgerHash: string
	}
) => {
	if (typeof specifier === 'object') {
		if (specifier.ledgerHash.length === 0)
			throw new Error('XrplClio_JsonRpc: ledger hash must not be empty')
	} else if (specifier !== 'validated') {
		if (!Number.isSafeInteger(specifier) || specifier < 0)
			throw new Error('XrplClio_JsonRpc: ledger index must be a nonnegative safe integer')
	}

	return assertEnvelope(
		'ledger transactions',
		xrplClioLedgerWithTransactions,
		await jsonRpc2<unknown>(remoteQueryBinding(), 'ledger', [{
			...(
				typeof specifier === 'object' ?
					{
						ledger_hash: specifier.ledgerHash,
					}
				:
					{
						ledger_index: specifier,
					}
			),
			transactions: true,
			expand: true,
		}])
	)
}

export const getLedgerData = async (
	limit: number,
	ledgerIndex: XrplClioLedgerSpecifier = 'validated',
	marker?: XrplClioMarker
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 400)
		throw new Error('XrplClio_JsonRpc: invalid ledger data limit')
	if (ledgerIndex !== 'validated' && (!Number.isSafeInteger(ledgerIndex) || ledgerIndex < 0))
		throw new Error('XrplClio_JsonRpc: ledger index must be a nonnegative safe integer')

	return assertEnvelope(
		'ledger_data',
		xrplClioLedgerData,
		await jsonRpc2<unknown>(remoteQueryBinding(), 'ledger_data', [{
			ledger_index: ledgerIndex,
			limit,
			type: 'state',
			...(marker != null && {
				marker,
			}),
		}])
	) as XrplClioLedgerDataResult
}

export const getTransaction = async (
	hash: string
) => {
	if (hash.length === 0)
		throw new Error('XrplClio_JsonRpc: transaction hash must not be empty')

	return assertEnvelope(
		'tx',
		xrplClioTransaction,
		await jsonRpc2<unknown>(remoteQueryBinding(), 'tx', [{
			transaction: hash,
			binary: false,
		}])
	) as XrplClioTransactionResult
}

/**
 * Count ledgers advertised in `server_info.info.complete_ledgers`
 * (`"2-14,44-44,46-158"`). Empty / missing → undefined (caller falls back).
 */
export const countCompleteLedgers = (
	completeLedgers: string | undefined
) => {
	if (completeLedgers == null || completeLedgers.length === 0)
		return undefined

	let total = 0
	for (const part of completeLedgers.split(',')) {
		const range = part.trim()
		if (range.length === 0)
			throw new Error('XrplClio_JsonRpc: malformed complete_ledgers')

		const dash = range.indexOf('-')
		if (dash < 0) {
			const index = Number(range)
			if (!Number.isSafeInteger(index) || index < 0)
				throw new Error('XrplClio_JsonRpc: malformed complete_ledgers')
			total += 1
			continue
		}

		const start = Number(range.slice(0, dash))
		const end = Number(range.slice(dash + 1))
		if (
			!Number.isSafeInteger(start)
			|| !Number.isSafeInteger(end)
			|| start < 0
			|| end < start
		)
			throw new Error('XrplClio_JsonRpc: malformed complete_ledgers')

		const span = end - start + 1
		if (!Number.isSafeInteger(span) || span < 1)
			throw new Error('XrplClio_JsonRpc: malformed complete_ledgers')
		total += span
	}

	if (!Number.isSafeInteger(total) || total < 1)
		throw new Error('XrplClio_JsonRpc: malformed complete_ledgers')
	return total
}

export const subscribeLedger = async function* (
	binding: SourceBinding,
	signal?: AbortSignal
): AsyncGenerator<JsonObject> {
	if (signal?.aborted)
		return

	if (
		binding.delivery !== SourceDelivery.RemoteLive
		|| !binding.operationGroups.includes(SourceOperationGroup.GenericSubscribe)
		|| !binding.endpoints.some((endpoint) => (
			endpoint.endpointKind === SourceEndpointKind.WebSocketUrl
		))
	)
		throw new Error('XrplClio_JsonRpc: subscribeLedger requires the RemoteLive WebSocket binding')

	const ledgers = xrplLedgerLive({
		bindingId: sourceBindingId(binding),
		targetKey: binding.target.key,
	})[Symbol.asyncIterator]()
	const abort = () => {
		void ledgers.return?.()
	}
	signal?.addEventListener('abort', abort, { once: true })

	try {
		for (
			let result = await ledgers.next();
			!result.done;
			result = await ledgers.next()
		) {
			if (signal?.aborted)
				return

			yield result.value
		}
	} finally {
		signal?.removeEventListener('abort', abort)
		await ledgers.return?.()
	}
}

export const streamLedger = (signal?: AbortSignal) => {
	const binding = bindings[Source.XrplClio_JsonRpc].find((candidate) => (
		candidate.delivery === SourceDelivery.RemoteLive
	))
	if (binding == null)
		throw new Error('XrplClio_JsonRpc: RemoteLive binding is missing')

	return subscribeLedger(binding, signal)
}
