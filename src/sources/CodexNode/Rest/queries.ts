import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { CodexNodeJson } from '$/sources/CodexNode/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<CodexNodeJson>(binding, path)
)
