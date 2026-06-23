import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { LibtorrentSessionJson } from '$/sources/LibtorrentSession/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<LibtorrentSessionJson>(binding, path)
)
