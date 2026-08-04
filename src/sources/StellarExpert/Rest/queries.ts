import {
	getJson,
	getText,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import { Source } from '$/sources/Source.ts'
import type { paths } from '$/sources/StellarExpert/OpenApi/openapi.d.ts'
import bindings from '$/sources/StellarExpert/bindings.ts'

const binding = bindings[Source.StellarExpert][0]

type ExplorerNetwork = paths['/explorer/{network}/asset']['get']['parameters']['path']['network']

const assetPathSegment = (
	asset: string
) => {
	if (asset.length === 0)
		throw new Error('StellarExpert: asset path is empty')

	return encodeURIComponent(asset)
}

export const getAllAssets = (
	{
		network,
		search,
		sort,
		order,
		limit,
		cursor,
	}: paths['/explorer/{network}/asset']['get']['parameters']['path']
		& NonNullable<paths['/explorer/{network}/asset']['get']['parameters']['query']>
) => {
	const searchParams = new URLSearchParams({
		...(search != null && { search }),
		...(sort != null && { sort }),
		...(order != null && { order }),
		...(limit != null && { limit: String(limit) }),
		...(cursor != null && { cursor: String(cursor) }),
	})

	return getJson<paths['/explorer/{network}/asset']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/explorer/${network}/asset${searchParams.size === 0 ? '' : `?${searchParams}`}`
	)
}

export const getAssetRating = (
	{
		network,
		asset,
	}: {
		network: ExplorerNetwork
		asset: string
	}
) => (
	getJson<paths['/explorer/{network}/asset/{asset}/rating']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/explorer/${network}/asset/${assetPathSegment(asset)}/rating`
	)
)

export const getAssetSupply = (
	{
		network,
		asset,
	}: {
		network: ExplorerNetwork
		asset: string
	}
) => (
	getText(
		binding,
		`/explorer/${network}/asset/${assetPathSegment(asset)}/supply`
	)
)

export const getSequenceFromTimestamp = (
	{
		network,
		timestamp,
	}: paths['/explorer/{network}/ledger/sequence-from-timestamp']['get']['parameters']['path']
		& paths['/explorer/{network}/ledger/sequence-from-timestamp']['get']['parameters']['query']
) => (
	getJson<paths['/explorer/{network}/ledger/sequence-from-timestamp']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/explorer/${network}/ledger/sequence-from-timestamp?${new URLSearchParams({
			timestamp: String(timestamp),
		})}`
	)
)

export const getTimestampFromSequence = (
	{
		network,
		sequence,
	}: paths['/explorer/{network}/ledger/timestamp-from-sequence']['get']['parameters']['path']
		& paths['/explorer/{network}/ledger/timestamp-from-sequence']['get']['parameters']['query']
) => (
	getJson<paths['/explorer/{network}/ledger/timestamp-from-sequence']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/explorer/${network}/ledger/timestamp-from-sequence?${new URLSearchParams({
			sequence: String(sequence),
		})}`
	)
)
