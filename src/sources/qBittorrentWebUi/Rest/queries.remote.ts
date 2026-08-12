import { query } from '$app/server'
import { type } from 'arktype'

import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import bindings from '$/sources/qBittorrentWebUi/bindings.ts'
import {
	getApplicationVersion as getApplicationVersionFromClient,
	getTorrentFiles as getTorrentFilesFromClient,
	getTorrentPieceStates as getTorrentPieceStatesFromClient,
	getTorrentProperties as getTorrentPropertiesFromClient,
	getTorrentsInfo as getTorrentsInfoFromClient,
	getTransferInfo as getTransferInfoFromClient,
} from '$/sources/qBittorrentWebUi/Rest/queries.ts'


const binding = bindings[Source.qBittorrentWebUi_Rest][0]

const applicationVersionRemote = query(() => getApplicationVersionFromClient(binding))
const torrentsInfoRemote = query(() => getTorrentsInfoFromClient(binding))
const transferInfoRemote = query(() => getTransferInfoFromClient(binding))

const torrentIdentity = type({
	infoHash: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
})

const torrentFilesRemote = query(
	torrentIdentity,
	({ infoHash }) => getTorrentFilesFromClient(binding, infoHash)
)
const torrentPieceStatesRemote = query(
	torrentIdentity,
	({ infoHash }) => getTorrentPieceStatesFromClient(binding, infoHash)
)
const torrentPropertiesRemote = query(
	torrentIdentity,
	({ infoHash }) => getTorrentPropertiesFromClient(binding, infoHash)
)

export const getApplicationVersion = (_binding: SourceBinding) => applicationVersionRemote()
export const getTorrentsInfo = (_binding: SourceBinding) => torrentsInfoRemote()
export const getTransferInfo = (_binding: SourceBinding) => transferInfoRemote()
export const getTorrentFiles = (_binding: SourceBinding, infoHash: string) => torrentFilesRemote({ infoHash })
export const getTorrentPieceStates = (_binding: SourceBinding, infoHash: string) => torrentPieceStatesRemote({ infoHash })
export const getTorrentProperties = (_binding: SourceBinding, infoHash: string) => torrentPropertiesRemote({ infoHash })
