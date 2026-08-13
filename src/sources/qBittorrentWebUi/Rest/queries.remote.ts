import { query } from '$app/server'
import { type } from 'arktype'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/qBittorrentWebUi/bindings.ts'
import {
	getApplicationVersion as getApplicationVersionFromClient,
	getTorrentFiles as getTorrentFilesFromClient,
	getTorrentPeers as getTorrentPeersFromClient,
	getTorrentPieceStates as getTorrentPieceStatesFromClient,
	getTorrentProperties as getTorrentPropertiesFromClient,
	getTorrentTrackers as getTorrentTrackersFromClient,
	getTorrentsInfo as getTorrentsInfoFromClient,
	getTransferInfo as getTransferInfoFromClient,
} from '$/sources/qBittorrentWebUi/Rest/queries.ts'


const binding = bindings[Source.qBittorrentWebUi_Rest][0]

export const getApplicationVersion = query(() => getApplicationVersionFromClient(binding))
export const getTorrentsInfo = query(() => getTorrentsInfoFromClient(binding))
export const getTransferInfo = query(() => getTransferInfoFromClient(binding))

const torrentIdentity = type({
	infoHash: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
})

export const getTorrentFiles = query(
	torrentIdentity,
	({ infoHash }) => getTorrentFilesFromClient(binding, infoHash)
)
export const getTorrentPieceStates = query(
	torrentIdentity,
	({ infoHash }) => getTorrentPieceStatesFromClient(binding, infoHash)
)
export const getTorrentProperties = query(
	torrentIdentity,
	({ infoHash }) => getTorrentPropertiesFromClient(binding, infoHash)
)
export const getTorrentTrackers = query(
	torrentIdentity,
	({ infoHash }) => getTorrentTrackersFromClient(binding, infoHash)
)
export const getTorrentPeers = query(
	torrentIdentity,
	({ infoHash }) => getTorrentPeersFromClient(binding, infoHash)
)
