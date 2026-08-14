import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/qBittorrentWebUi/bindings.ts'
import {
	getJson,
	getText,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import {
	type as arktype,
	type Type,
} from 'arktype'

const binding = bindings[Source.qBittorrentWebUi_Rest][0]

export type QBittorrentTransferInfo = {
	dl_info_speed?: number
	up_info_speed?: number
	dl_info_data?: number
	up_info_data?: number
}

export type QBittorrentApplicationPreferences = {
	listen_port?: number
	current_interface_address?: string
}

export type QBittorrentTorrentInfo = {
	hash: string
	name?: string
	state?: string
	save_path?: string
	downloaded?: number
	uploaded?: number
	dlspeed?: number
	upspeed?: number
	num_seeds?: number
	num_leechs?: number
	amount_left?: number
	progress?: number
	priority?: number
	ratio?: number
}

export type QBittorrentTorrentFile = {
	index: number
	name: string
	size: number
	progress?: number
	priority?: number
}

export type QBittorrentTorrentProperties = {
	piece_size?: number
	total_size?: number
	creation_date?: number
	created_by?: string
	comment?: string
}

export type QBittorrentTorrentTracker = {
	url: string
	status?: number
	num_peers?: number
	num_seeds?: number
	num_leeches?: number
	num_downloaded?: number
	msg?: string
}

export type QBittorrentTorrentPeer = {
	peer_id_client?: string
	ip?: string
	port?: number
	client?: string
	progress?: number
}

export type QBittorrentTorrentPeers = {
	rid: number
	full_update: boolean
	peers?: Record<string, QBittorrentTorrentPeer>
	peers_removed?: string[]
}


const nonNegativeNumber = arktype('number >= 0')

const qBittorrentApplicationPreferencesWire = arktype({
	'listen_port?': 'number.integer >= 1 <= 65535',
	'current_interface_address?': 'string',
}) satisfies Type<QBittorrentApplicationPreferences>

const qBittorrentTransferInfoWire = arktype({
	'dl_info_speed?': nonNegativeNumber,
	'up_info_speed?': nonNegativeNumber,
	'dl_info_data?': nonNegativeNumber,
	'up_info_data?': nonNegativeNumber,
}) satisfies Type<QBittorrentTransferInfo>

const qBittorrentTorrentInfoWire = arktype({
	hash: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	'name?': 'string',
	'state?': 'string',
	'save_path?': 'string',
	'downloaded?': nonNegativeNumber,
	'uploaded?': nonNegativeNumber,
	'dlspeed?': nonNegativeNumber,
	'upspeed?': nonNegativeNumber,
	'num_seeds?': 'number.integer >= 0',
	'num_leechs?': 'number.integer >= 0',
	'amount_left?': nonNegativeNumber,
	'progress?': 'number >= 0 <= 1',
	'priority?': 'number.integer >= -1',
	'ratio?': 'number >= 0 <= 9999',
}) satisfies Type<QBittorrentTorrentInfo>

const qBittorrentTorrentInfoListWire = qBittorrentTorrentInfoWire.array()

const qBittorrentTorrentFileListWire = arktype({
	index: 'number.integer >= 0',
	name: 'string > 0',
	size: nonNegativeNumber,
	'progress?': 'number >= 0 <= 1',
	'priority?': 'number.integer >= 0',
}).array() satisfies Type<QBittorrentTorrentFile[]>

const qBittorrentPieceStateListWire = arktype('(0 | 1 | 2)[]')

const qBittorrentTorrentPropertiesWire = arktype({
	'piece_size?': nonNegativeNumber,
	'total_size?': nonNegativeNumber,
	'creation_date?': nonNegativeNumber,
	'created_by?': 'string',
	'comment?': 'string',
}) satisfies Type<QBittorrentTorrentProperties>

const qBittorrentTorrentTrackerListWire = arktype({
	url: 'string > 0',
	'status?': 'number.integer >= 0 <= 4',
	'num_peers?': 'number.integer >= -1',
	'num_seeds?': 'number.integer >= -1',
	'num_leeches?': 'number.integer >= -1',
	'num_downloaded?': 'number.integer >= -1',
	'msg?': 'string',
}).array() satisfies Type<QBittorrentTorrentTracker[]>

const qBittorrentTorrentPeerWire = arktype({
	'peer_id_client?': 'string',
	'ip?': 'string',
	'port?': 'number.integer >= 0 <= 65535',
	'client?': 'string',
	'progress?': 'number >= 0 <= 1',
}) satisfies Type<QBittorrentTorrentPeer>

const qBittorrentTorrentPeersWire = arktype({
	rid: 'number.integer >= 0',
	full_update: 'boolean',
	'peers?': {
		'[string]': qBittorrentTorrentPeerWire,
	},
	'peers_removed?': 'string[]',
}) satisfies Type<QBittorrentTorrentPeers>

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	value: unknown
) => {
	try {
		return wire.assert(value)
	} catch {
		throw new Error(`qBittorrentWebUi_Rest: invalid ${label} response envelope`)
	}
}

export const getApplicationVersion = () => (
	getText(binding, '/api/v2/app/version')
		.then((version) => {
			const normalizedVersion = version.trim()
			if (normalizedVersion === '')
				throw new Error('qBittorrentWebUi_Rest: application version is blank')

			return normalizedVersion
		})
)

export const getApplicationPreferences = () => (
	getJson<unknown>(binding, '/api/v2/app/preferences')
		.then((response) => assertEnvelope(
			'application preferences',
			qBittorrentApplicationPreferencesWire,
			response
		))
)

export const getTorrentsInfo = () => (
	getJson<unknown>(binding, '/api/v2/torrents/info')
		.then((response) => assertEnvelope(
			'torrents info',
			qBittorrentTorrentInfoListWire,
			response
		))
)

export const getTransferInfo = () => (
	getJson<unknown>(binding, '/api/v2/transfer/info')
		.then((response) => assertEnvelope(
			'transfer info',
			qBittorrentTransferInfoWire,
			response
		))
)

export const getTorrentFiles = (
	infoHash: string
) => (
	getJson<unknown>(binding, `/api/v2/torrents/files?hash=${encodeURIComponent(infoHash)}`)
		.then((response) => assertEnvelope(
			'torrent files',
			qBittorrentTorrentFileListWire,
			response
		))
)

export const getTorrentPieceStates = (
	infoHash: string
) => (
	getJson<unknown>(binding, `/api/v2/torrents/pieceStates?hash=${encodeURIComponent(infoHash)}`)
		.then((response) => assertEnvelope(
			'torrent piece states',
			qBittorrentPieceStateListWire,
			response
		))
)

export const getTorrentProperties = (
	infoHash: string
) => (
	getJson<unknown>(binding, `/api/v2/torrents/properties?hash=${encodeURIComponent(infoHash)}`)
		.then((response) => assertEnvelope(
			'torrent properties',
			qBittorrentTorrentPropertiesWire,
			response
		))
)

export const getTorrentTrackers = (
	infoHash: string
) => (
	getJson<unknown>(binding, `/api/v2/torrents/trackers?hash=${encodeURIComponent(infoHash)}`)
		.then((response) => assertEnvelope(
			'torrent trackers',
			qBittorrentTorrentTrackerListWire,
			response
		))
)

export const getTorrentPeers = (
	infoHash: string
) => (
	getJson<unknown>(binding, `/api/v2/sync/torrentPeers?hash=${encodeURIComponent(infoHash)}&rid=0`)
		.then((response) => {
			const peers = assertEnvelope(
				'torrent peers',
				qBittorrentTorrentPeersWire,
				response
			)
			if (!peers.full_update || (peers.peers_removed?.length ?? 0) !== 0)
				throw new Error('qBittorrentWebUi_Rest: torrent peers response is not a complete snapshot')

			return peers
		})
)
