import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Pyth/bindings.ts'
import type { paths } from '$/sources/Pyth/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.PythHermes_Rest][0]

export const getPriceFeeds = (
	parameters: NonNullable<paths['/v2/price_feeds']['get']['parameters']['query']> = {}
) => (
	getJson<paths['/v2/price_feeds']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/v2/price_feeds${
			parameters.query != null || parameters.asset_type != null ?
				`?${new URLSearchParams({
					...(parameters.query != null && { query: parameters.query }),
					...(parameters.asset_type != null && { asset_type: parameters.asset_type }),
				})}`
				:
				''
		}`
	)
)

export const getLatestPriceUpdates = (
	parameters: paths['/v2/updates/price/latest']['get']['parameters']['query']
) => (
	getJson<paths['/v2/updates/price/latest']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/v2/updates/price/latest?${new URLSearchParams([
			...parameters['ids[]'].map((id) => ['ids[]', id]),
			...(parameters.encoding != null ? [['encoding', parameters.encoding]] : []),
			...(parameters.parsed != null ? [['parsed', String(parameters.parsed)]] : []),
			...(parameters.ignore_invalid_price_ids != null ?
				[['ignore_invalid_price_ids', String(parameters.ignore_invalid_price_ids)]]
				:
				[]),
		])}`
	)
)
