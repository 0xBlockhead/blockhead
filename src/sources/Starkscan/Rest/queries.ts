import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { StarkscanJson } from '$/sources/Starkscan/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<StarkscanJson>(binding, path)
)
