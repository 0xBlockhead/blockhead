import { query } from '$app/server'
import { type } from 'arktype'

import {
	getApplicationPreferences as getApplicationPreferencesFromClient,
	getApplicationVersion as getApplicationVersionFromClient,
	getTorrentFiles as getTorrentFilesFromClient,
	getTorrentPeers as getTorrentPeersFromClient,
	getTorrentPieceStates as getTorrentPieceStatesFromClient,
	getTorrentProperties as getTorrentPropertiesFromClient,
	getTorrentTrackers as getTorrentTrackersFromClient,
	getTorrentsInfo as getTorrentsInfoFromClient,
	getTransferInfo as getTransferInfoFromClient,
} from '$/sources/qBittorrentWebUi/Rest/queries.ts'


export const getApplicationVersion = query(() => getApplicationVersionFromClient())
export const getApplicationPreferences = query(() => getApplicationPreferencesFromClient())
export const getTorrentsInfo = query(() => getTorrentsInfoFromClient())
export const getTransferInfo = query(() => getTransferInfoFromClient())

const torrentIdentity = type({
	infoHash: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
})

export const getTorrentFiles = query(
	torrentIdentity,
	({ infoHash }) => getTorrentFilesFromClient(infoHash)
)
export const getTorrentPieceStates = query(
	torrentIdentity,
	({ infoHash }) => getTorrentPieceStatesFromClient(infoHash)
)
export const getTorrentProperties = query(
	torrentIdentity,
	({ infoHash }) => getTorrentPropertiesFromClient(infoHash)
)
export const getTorrentTrackers = query(
	torrentIdentity,
	({ infoHash }) => getTorrentTrackersFromClient(infoHash)
)
export const getTorrentPeers = query(
	torrentIdentity,
	({ infoHash }) => getTorrentPeersFromClient(infoHash)
)
