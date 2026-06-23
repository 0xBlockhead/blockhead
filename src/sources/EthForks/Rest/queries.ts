import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { EthForksJson } from '$/sources/EthForks/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<EthForksJson>(binding, path)
)
