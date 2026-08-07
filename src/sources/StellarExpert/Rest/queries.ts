import { getJson, getText } from '$/sources/_shared/wire/HttpRest/client.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/StellarExpert/bindings.ts'
import {
	stellarExpertAssetPageWire,
	stellarExpertAssetRatingWire,
	stellarExpertLedgerTimestampSequenceWire,
	stellarExpertNetworkWire,
	type StellarExpertAssetPage,
	type StellarExpertLedgerTimestampSequence,
	type StellarExpertNetwork,
} from '$/sources/StellarExpert/Rest/types.ts'


const binding = bindings[Source.StellarExpert][0]

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
		throw new Error(`StellarExpert: invalid ${label} response envelope`)
	}
}

const assertNetwork = (
	network: string
): StellarExpertNetwork => {
	try {
		return stellarExpertNetworkWire.assert(network)
	} catch {
		throw new Error('StellarExpert: unsupported explorer network')
	}
}

const assetPathSegment = (
	asset: string
) => {
	if (asset.length === 0)
		throw new Error('StellarExpert: asset path is empty')

	return encodeURIComponent(asset)
}

const assertLedgerDomain = (
	ledger: StellarExpertLedgerTimestampSequence
) => {
	if (!Number.isSafeInteger(ledger.timestamp * 1_000))
		throw new Error('StellarExpert: invalid ledger timestamp')
	if (Date.parse(ledger.date) !== ledger.timestamp * 1_000)
		throw new Error('StellarExpert: ledger date does not match timestamp')
}

const assertAssetPageDomain = (
	page: StellarExpertAssetPage,
	limit?: number
) => {
	if (limit != null && page._embedded.records.length > limit)
		throw new Error('StellarExpert: asset page exceeds requested limit')
	const assets = new Set<string>()
	for (const record of page._embedded.records) {
		if (assets.has(record.asset))
			throw new Error('StellarExpert: duplicate asset record')
		assets.add(record.asset)
	}
}

export const getAllAssets = async (
	{
		network,
		search,
		sort,
		order,
		limit,
		cursor,
	}: {
		network: StellarExpertNetwork
		search?: string
		sort?: 'rating' | 'created' | 'payments' | 'trades' | 'trustlines' | 'volume' | 'volume7d'
		order?: 'asc' | 'desc'
		limit?: number
		cursor?: number
	}
) => {
	assertNetwork(network)
	if (limit != null && (!Number.isSafeInteger(limit) || limit < 0 || limit > 200))
		throw new Error('StellarExpert: page limit must be an integer from 0 through 200')
	if (cursor != null && (!Number.isSafeInteger(cursor) || cursor < 0))
		throw new Error('StellarExpert: cursor must be a non-negative safe integer')
	if (limit === 0)
		return {
			_embedded: {
				records: [],
			},
		} satisfies StellarExpertAssetPage

	const searchParams = new URLSearchParams({
		...(search != null && { search }),
		...(sort != null && { sort }),
		...(order != null && { order }),
		...(limit != null && { limit: String(limit) }),
		...(cursor != null && { cursor: String(cursor) }),
	})

	const page = assertEnvelope(
		'asset page',
		stellarExpertAssetPageWire,
		await getJson(
			binding,
			`/explorer/${network}/asset${searchParams.size === 0 ? '' : `?${searchParams}`}`
		)
	)
	assertAssetPageDomain(page, limit)
	return page
}

export const getAssetRating = async (
	{
		network,
		asset,
	}: {
		network: StellarExpertNetwork
		asset: string
	}
) => {
	assertNetwork(network)
	const pathAsset = assetPathSegment(asset)
	const rating = assertEnvelope(
		'asset rating',
		stellarExpertAssetRatingWire,
		await getJson(
			binding,
			`/explorer/${network}/asset/${pathAsset}/rating`
		)
	)
	if (rating.asset !== asset)
		throw new Error('StellarExpert: asset rating response does not match request')
	return rating
}

export const getAssetSupply = async (
	{
		network,
		asset,
	}: {
		network: StellarExpertNetwork
		asset: string
	}
) => {
	assertNetwork(network)
	const pathAsset = assetPathSegment(asset)
	const supply = await getText(
		binding,
		`/explorer/${network}/asset/${pathAsset}/supply`
	)
	if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(supply))
		throw new Error('StellarExpert: invalid asset supply response envelope')
	return supply
}

export const getSequenceFromTimestamp = async (
	{
		network,
		timestamp,
	}: {
		network: StellarExpertNetwork
		timestamp: number | string
	}
) => {
	assertNetwork(network)
	const ledger = assertEnvelope(
		'ledger sequence-from-timestamp',
		stellarExpertLedgerTimestampSequenceWire,
		await getJson(
			binding,
			`/explorer/${network}/ledger/sequence-from-timestamp?${new URLSearchParams({
				timestamp: String(timestamp),
			})}`
		)
	)
	assertLedgerDomain(ledger)
	return ledger
}

export const getTimestampFromSequence = async (
	{
		network,
		sequence,
	}: {
		network: StellarExpertNetwork
		sequence: number
	}
) => {
	assertNetwork(network)
	if (!Number.isSafeInteger(sequence) || sequence < 0)
		throw new Error('StellarExpert: invalid ledger sequence')
	const ledger = assertEnvelope(
		'ledger timestamp-from-sequence',
		stellarExpertLedgerTimestampSequenceWire,
		await getJson(
			binding,
			`/explorer/${network}/ledger/timestamp-from-sequence?${new URLSearchParams({
				sequence: String(sequence),
			})}`
		)
	)
	assertLedgerDomain(ledger)
	if (ledger.sequence !== sequence)
		throw new Error('StellarExpert: response ledger sequence does not match request')
	return ledger
}
