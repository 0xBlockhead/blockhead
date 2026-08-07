import { throwHttpError } from '$/lib/http.ts'
import {
	requiredPublicEnvString,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Bithomp/bindings.ts'
import {
	bithompAccount,
	bithompAmm,
	bithompAmms,
	bithompLedgerEntry,
	bithompSearch,
	bithompTransactions,
	bithompTrustlines,
	bithompUsername,
	type BithompAccount,
	type BithompAmm,
	type BithompAmms,
	type BithompLedgerEntry,
	type BithompSearch,
	type BithompTransactions,
	type BithompTrustlines,
	type BithompUsername,
} from '$/sources/Bithomp/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Bithomp][0]
const baseUrl = firstHttpUrlForBinding(binding)

const bithompTokenHeaders = (publicEnv: SourcePublicEnv) => ({
	'x-bithomp-token': requiredPublicEnvString(publicEnv, 'PUBLIC_BITHOMP_API_KEY'),
})

const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object')
		return Object.fromEntries(
			Object.entries(value)
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
		throw new Error(`Bithomp: invalid ${label} response envelope`)
	}
}

const queryString = (parameters: Record<string, string | number | boolean | undefined>) => (
	Object.entries(parameters)
		.flatMap(([key, value]) => (
			value == null || value === false ?
				[]
			: value === true ?
				[[
					key,
					'true',
				]]
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
		throw new Error(`Bithomp: ${label} must not be empty`)
}

const assertPositiveLimit = (
	limit: number | undefined,
	label: string
) => {
	if (limit == null)
		return
	if (!Number.isSafeInteger(limit) || limit < 1)
		throw new Error(`Bithomp: ${label} limit must be a positive safe integer`)
}

const fetchJson = async (
	publicEnv: SourcePublicEnv,
	path: string,
	label: string
) => {
	const response = await sourceFetch(
		binding,
		new URL(path, baseUrl).toString(),
		{
			headers: bithompTokenHeaders(publicEnv),
		}
	)
	if (!response.ok)
		await throwHttpError(`Bithomp ${label}`, response)
	return response.json<unknown>()
}

export const getAccount = async (
	publicEnv: SourcePublicEnv,
	{
		address,
	}: {
		address: string
	}
) => {
	assertNonempty(address, 'address')
	return assertEnvelope(
		'account',
		bithompAccount,
		await fetchJson(
			publicEnv,
			`address/${encodeURIComponent(address)}?ledgerInfo=true`,
			'get account'
		)
	) as BithompAccount
}

export const getAmm = async (
	publicEnv: SourcePublicEnv,
	{
		id,
	}: {
		id: string
	}
) => {
	assertNonempty(id, 'amm id')
	return assertEnvelope(
		'amm',
		bithompAmm,
		await fetchJson(
			publicEnv,
			`amm/${encodeURIComponent(id)}`,
			'get amm'
		)
	) as BithompAmm
}

export const getAmms = async (
	publicEnv: SourcePublicEnv,
	{
		marker,
		limit,
		order,
	}: {
		marker?: string
		limit?: number
		order?: string
	} = {}
) => {
	assertPositiveLimit(limit, 'amms')
	const search = queryString({
		marker,
		limit,
		order,
	})
	return assertEnvelope(
		'amms',
		bithompAmms,
		await fetchJson(
			publicEnv,
			`amms${search.length > 0 ? `?${search}` : ''}`,
			'get amms'
		)
	) as BithompAmms
}

export const getTrustlines = async (
	publicEnv: SourcePublicEnv,
	{
		address,
	}: {
		address: string
	}
) => {
	assertNonempty(address, 'address')
	return assertEnvelope(
		'trustlines',
		bithompTrustlines,
		await fetchJson(
			publicEnv,
			`trustlines/${encodeURIComponent(address)}`,
			'get trustlines'
		)
	) as BithompTrustlines
}

export const getAccountTransactions = async (
	publicEnv: SourcePublicEnv,
	{
		address,
		limit,
		marker,
		startTxHash,
	}: {
		address: string
		limit?: number
		marker?: string
		startTxHash?: string
	}
) => {
	assertNonempty(address, 'address')
	assertPositiveLimit(limit, 'account transactions')
	const search = queryString({
		limit,
		marker,
		startTxHash,
		includeRawTransactions: true,
	})
	return assertEnvelope(
		'account transactions',
		bithompTransactions,
		await fetchJson(
			publicEnv,
			`transactions/${encodeURIComponent(address)}${search.length > 0 ? `?${search}` : ''}`,
			'get account transactions'
		)
	) as BithompTransactions
}

export const getLedgerEntry = async (
	publicEnv: SourcePublicEnv,
	{
		index,
		ledgerIndex,
	}: {
		index: string
		ledgerIndex?: number
	}
) => {
	assertNonempty(index, 'ledger entry index')
	if (ledgerIndex != null && (!Number.isSafeInteger(ledgerIndex) || ledgerIndex < 0))
		throw new Error('Bithomp: ledger index must be a nonnegative safe integer')
	const search = queryString({
		ledgerIndex,
	})
	return assertEnvelope(
		'ledger entry',
		bithompLedgerEntry,
		await fetchJson(
			publicEnv,
			`ledgerEntry/${encodeURIComponent(index)}${search.length > 0 ? `?${search}` : ''}`,
			'get ledger entry'
		)
	) as BithompLedgerEntry
}

export const getSearch = async (
	publicEnv: SourcePublicEnv,
	{
		value,
		type,
	}: {
		value: string
		type?: string
	}
) => {
	assertNonempty(value, 'search value')
	const search = queryString({
		type,
	})
	return assertEnvelope(
		'search',
		bithompSearch,
		await fetchJson(
			publicEnv,
			`search/${encodeURIComponent(value)}${search.length > 0 ? `?${search}` : ''}`,
			'get search'
		)
	) as BithompSearch
}

export const getUsername = async (
	publicEnv: SourcePublicEnv,
	{
		username,
	}: {
		username: string
	}
) => {
	assertNonempty(username, 'username')
	return assertEnvelope(
		'username',
		bithompUsername,
		await fetchJson(
			publicEnv,
			`username/${encodeURIComponent(username)}`,
			'get username'
		)
	) as BithompUsername
}
