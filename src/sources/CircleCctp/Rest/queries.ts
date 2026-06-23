import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { CircleCctpJson } from '$/sources/CircleCctp/Rest/types.ts'

export const query = (binding: SourceBinding, path: string) => (
	getJson<CircleCctpJson>(binding, path)
)
