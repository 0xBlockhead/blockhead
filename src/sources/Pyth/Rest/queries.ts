import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { PythJson } from '$/sources/Pyth/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<PythJson>(binding, path)
)

export const getLatestPriceFeeds = (
	binding: SourceBinding,
	ids: readonly string[]
) => (
	query(binding, `/v2/updates/price/latest?${new URLSearchParams(ids.map((id) => ['ids[]', id]))}`)
)
