import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { QBittorrentJson } from '$/sources/qBittorrentWebUi/Rest/types.ts'

export const getApplicationVersion = (binding: SourceBinding) => (
	getJson<string>(binding, '/api/v2/app/version')
)

export const getTorrentsInfo = (
	binding: SourceBinding
) => (
	getJson<QBittorrentJson>(binding, '/api/v2/torrents/info')
)

export const getTransferInfo = (
	binding: SourceBinding
) => (
	getJson<QBittorrentJson>(binding, '/api/v2/transfer/info')
)
