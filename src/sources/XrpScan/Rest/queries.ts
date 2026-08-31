import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/XrpScan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	xrpScanAccount,
	xrpScanAccountTransactions,
	xrpScanAccountTrustlines,
	xrpScanAmm,
	xrpScanLedger,
	xrpScanLedgers,
	xrpScanObject,
	xrpScanServerInfo,
	xrpScanTransaction,
	type XrpScanAccount,
	type XrpScanAccountTransactions,
	type XrpScanAccountTrustlines,
	type XrpScanAmm,
	type XrpScanLedger,
	type XrpScanLedgers,
	type XrpScanObject,
	type XrpScanServerInfo,
	type XrpScanTransaction,
} from '$/sources/XrpScan/Rest/types.ts'

const binding = bindings[Source.XrpScan_Rest][0]
const baseUrl = `${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/api/v1`

const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object')
		return Object.fromEntries(
			Object.entries<unknown>(value)
				.filter(([, entry]) => entry !== undefined)
				.map(([key, entry]) => [
					key,
					omitUndefinedJson(entry),
				])
		)
	return value
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(omitUndefinedJson(response))
	} catch {
		throw new Error(`XrpScan_Rest: invalid ${label} response envelope`)
	}
}

const assertEnvelopeArray = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	if (!Array.isArray(response))
		throw new Error(`XrpScan_Rest: invalid ${label} response envelope`)
	return response.map((row) => assertEnvelope(label, wire, row))
}

const queryString = (parameters: Record<string, string | number | undefined>) => (
	Object.entries(parameters)
		.flatMap(([key, value]) => (
			value == null ?
				[]
			:
				[[
					key,
					String(value),
				]]
		))
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
		.join('&')
)

const assertNonempty = (
	value: string,
	label: string
) => {
	if (value.length === 0)
		throw new Error(`XrpScan_Rest: ${label} must not be empty`)
}

const assertPositiveLimit = (
	limit: number | undefined,
	label: string
) => {
	if (limit == null)
		return
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 400)
		throw new Error(`XrpScan_Rest: ${label} limit must be a safe integer from 1 through 400`)
}

export const getServerInfo = async () => (
	assertEnvelope(
		'server_info',
		xrpScanServerInfo,
		await sourceGetJson<unknown>(binding, `${baseUrl}/network/server_info`)
	)
)

export const getAccount = async (
	account: string
) => {
	assertNonempty(account, 'account')
	return assertEnvelope(
		'account',
		xrpScanAccount,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/account/${encodeURIComponent(account)}`
		)
	)
}

export const getAccountTransactions = async ({
	account,
	limit,
	marker,
}: {
	account: string
	limit?: number
	marker?: string
}) => {
	assertNonempty(account, 'account')
	assertPositiveLimit(limit, 'account transactions')
	const search = queryString({
		limit,
		marker,
	})
	return assertEnvelope(
		'account transactions',
		xrpScanAccountTransactions,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/account/${encodeURIComponent(account)}/transactions${search.length > 0 ? `?${search}` : ''}`
		)
	)
}

export const getAccountTrustlines = async ({
	account,
	marker,
}: {
	account: string
	marker?: string
}) => {
	assertNonempty(account, 'account')
	const search = queryString({
		marker,
	})
	return assertEnvelope(
		'account trustlines',
		xrpScanAccountTrustlines,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/account/${encodeURIComponent(account)}/trustlines2${search.length > 0 ? `?${search}` : ''}`
		)
	)
}

export const getLedger = async (
	ledger: string | number
) => {
	const key = String(ledger)
	assertNonempty(key, 'ledger')
	return assertEnvelope(
		'ledger',
		xrpScanLedger,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/ledger/${encodeURIComponent(key)}`
		)
	)
}

export const getLedgers = async () => (
	assertEnvelope(
		'ledgers',
		xrpScanLedgers,
		await sourceGetJson<unknown>(binding, `${baseUrl}/ledgers`)
	)
)

export const getLedgerTransactions = async (
	ledgerIndex: number
) => {
	if (!Number.isSafeInteger(ledgerIndex) || ledgerIndex < 0)
		throw new Error('XrpScan_Rest: ledger index must be a nonnegative safe integer')
	return assertEnvelopeArray(
		'ledger transaction',
		xrpScanTransaction,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/ledger/${encodeURIComponent(String(ledgerIndex))}/transactions`
		)
	)
}

export const getTransaction = async (
	hash: string
) => {
	assertNonempty(hash, 'transaction hash')
	return assertEnvelope(
		'transaction',
		xrpScanTransaction,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/tx/${encodeURIComponent(hash)}`
		)
	)
}

export const getAmm = async (
	ammAccount: string
) => {
	assertNonempty(ammAccount, 'amm account')
	return assertEnvelope(
		'amm',
		xrpScanAmm,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/amm/${encodeURIComponent(ammAccount)}`
		)
	)
}

export const getObject = async (
	objectId: string
) => {
	assertNonempty(objectId, 'object id')
	return assertEnvelope(
		'object',
		xrpScanObject,
		await sourceGetJson<unknown>(
			binding,
			`${baseUrl}/object/${encodeURIComponent(objectId)}`
		)
	)
}
