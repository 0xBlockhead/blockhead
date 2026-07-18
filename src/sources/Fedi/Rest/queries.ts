import { corsFetch, throwIfHttpNotOk } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { FediJson } from './types.ts'

export const query = async (
	binding: SourceBinding,
	path: string
): Promise<FediJson> => {
	const url = `${binding.target.url}/${path}`
	const res = await corsFetch(url, { origins: binding.origins })
	await throwIfHttpNotOk(res, url)
	return res.json<FediJson>()
}
