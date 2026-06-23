import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { WormholescanJson } from '$/sources/Wormholescan/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<WormholescanJson>(binding, path)
)
