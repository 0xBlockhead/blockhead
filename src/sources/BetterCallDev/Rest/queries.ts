import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { BetterCallDevJson } from '$/sources/BetterCallDev/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<BetterCallDevJson>(binding, path)
)
