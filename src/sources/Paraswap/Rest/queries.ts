import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { ParaswapJson } from '$/sources/Paraswap/Rest/types.ts'

export const query = (binding: SourceBinding, path: string) => (
	getJson<ParaswapJson>(binding, path)
)
