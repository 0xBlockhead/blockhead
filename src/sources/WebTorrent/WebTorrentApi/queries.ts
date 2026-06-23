import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { WebTorrentRequest } from '$/sources/WebTorrent/WebTorrentApi/types.ts'
import { inProcessRequest } from '$/sources/_shared/wire/InProcess/client.ts'

export const torrentRequest = (
	binding: SourceBinding,
	request: WebTorrentRequest
) => (
	inProcessRequest(binding, request)
)
