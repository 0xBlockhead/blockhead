import { zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { sourcifyGetJsonOrNull } from '$/sources/Sourcify/Rest/client.ts'
import { contractLookupFields } from '$/sources/Sourcify/Rest/constants.ts'
import {
	sourcifyContractLookupEnvelope,
	sourcifyContractMatchListEnvelope,
	type SourcifyContractLookup,
	type SourcifyContractMatchSummary,
} from '$/sources/Sourcify/Rest/types.ts'

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
		throw new Error(`Sourcify_Rest: invalid ${label} response envelope`)
	}
}

const hasVerificationMatch = (
	json: SourcifyContractLookup
) => (
	(json.match != null && json.match !== '')
	|| (json.creationMatch != null && json.creationMatch !== '')
	|| (json.runtimeMatch != null && json.runtimeMatch !== '')
)

export const getContractLookupPath = ({
	chainId,
	address,
}: {
	chainId: number
	address: `0x${string}`
}) => (
	`/contract/${chainId}/${address}?${new URLSearchParams({
		fields: contractLookupFields.join(','),
	})}`
)

export const getContractLookupsByAddressPath = ({
	address,
}: {
	address: `0x${string}`
}) => (
	`/contract/all-chains/${address}`
)

export const listVerifiedContractsPath = ({
	chainId,
	limit,
	sort,
	afterMatchId,
}: {
	chainId: number
	limit?: number
	sort?: 'asc' | 'desc'
	afterMatchId?: string
}) => {
	const searchParams = new URLSearchParams()
	if (limit != null)
		searchParams.set('limit', String(Math.min(Math.max(1, Math.trunc(limit)), 200)))
	if (sort != null)
		searchParams.set('sort', sort)
	if (afterMatchId != null && afterMatchId !== '')
		searchParams.set('afterMatchId', afterMatchId)
	const query = searchParams.toString()
	return `/contracts/${chainId}${query === '' ? '' : `?${query}`}`
}

const assertLookupSubject = (
	lookup: SourcifyContractLookup,
	{
		chainId,
		address,
	}: {
		chainId: number
		address: `0x${string}`
	}
) => {
	if (lookup.chainId != null && Number(lookup.chainId) !== chainId)
		throw new Error('Sourcify_Rest: contract lookup belongs to a different chain')
	if (lookup.address != null && lookup.address.toLowerCase() !== address)
		throw new Error('Sourcify_Rest: contract lookup belongs to a different address')
}

const assertMatchListChainSubject = (
	results: SourcifyContractMatchSummary[],
	chainId: number
) => {
	for (const row of results) {
		if (row.chainId != null && Number(row.chainId) !== chainId)
			throw new Error('Sourcify_Rest: verified contract list includes a different chain')
	}
}

const assertMatchListAddressSubject = (
	results: SourcifyContractMatchSummary[],
	address: `0x${string}`
) => {
	for (const row of results) {
		if (row.address != null && row.address.toLowerCase() !== address)
			throw new Error('Sourcify_Rest: contract match list includes a different address')
	}
}

/** `GET /v2/contract/{chainId}/{address}` — verified contract lookup with product fields. */
export const getContractLookup = async ({
	chainId,
	address,
}: {
	chainId: number
	address: `0x${string}`
}) => {
	const normalizedAddress = zeroExLowerCase(address)
	const json = await sourcifyGetJsonOrNull({
		path: getContractLookupPath({
			chainId,
			address: normalizedAddress,
		}),
	})
	if (json == null) return null
	const lookup = assertEnvelope(
		'contract lookup',
		sourcifyContractLookupEnvelope,
		json
	) as SourcifyContractLookup
	assertLookupSubject(lookup, {
		chainId,
		address: normalizedAddress,
	})
	if (!hasVerificationMatch(lookup)) return null
	return lookup
}

/** `GET /v2/contract/all-chains/{address}` — match summaries for one address across chains. */
export const getContractLookupsByAddress = async ({
	address,
}: {
	address: `0x${string}`
}) => {
	const normalizedAddress = zeroExLowerCase(address)
	const json = await sourcifyGetJsonOrNull({
		path: getContractLookupsByAddressPath({
			address: normalizedAddress,
		}),
	})
	if (json == null) return null
	const results = assertEnvelope(
		'contract match list',
		sourcifyContractMatchListEnvelope,
		json
	).results as SourcifyContractMatchSummary[]
	assertMatchListAddressSubject(results, normalizedAddress)
	return results
}

/** `GET /v2/contracts/{chainId}` — paginated verified-contract summaries for a chain. */
export const listVerifiedContracts = async ({
	chainId,
	limit,
	sort,
	afterMatchId,
}: {
	chainId: number
	limit?: number
	sort?: 'asc' | 'desc'
	afterMatchId?: string
}) => {
	const json = await sourcifyGetJsonOrNull({
		path: listVerifiedContractsPath({
			chainId,
			limit,
			sort,
			afterMatchId,
		}),
	})
	if (json == null) return null
	const results = assertEnvelope(
		'verified contract list',
		sourcifyContractMatchListEnvelope,
		json
	).results as SourcifyContractMatchSummary[]
	assertMatchListChainSubject(results, chainId)
	return results
}
