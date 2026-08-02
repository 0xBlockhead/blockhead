import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import { Source } from '$/sources/Source.ts'
import type { paths } from '$/sources/StellarExpert/OpenApi/openapi.d.ts'
import bindings from '$/sources/StellarExpert/bindings.ts'

const binding = bindings[Source.StellarExpert][0]

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
