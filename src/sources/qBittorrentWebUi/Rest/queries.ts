import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	getJson,
	getText,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import {
	type as arktype,
	type Type,
} from 'arktype'


export type QBittorrentTransferInfo = {
	dl_info_speed?: number
	up_info_speed?: number
	dl_info_data?: number
	up_info_data?: number
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


const nonNegativeNumber = arktype('number >= 0')

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

export const getApplicationVersion = (binding: SourceBinding) => (
	getText(binding, '/api/v2/app/version')
		.then((version) => {
			const normalizedVersion = version.trim()
			if (normalizedVersion === '')
				throw new Error('qBittorrentWebUi_Rest: application version is blank')

			return normalizedVersion
		})
)

export const getTorrentsInfo = (
	binding: SourceBinding
) => (
	getJson<unknown>(binding, '/api/v2/torrents/info')
		.then((response) => assertEnvelope(
			'torrents info',
			qBittorrentTorrentInfoListWire,
			response
		))
)

export const getTransferInfo = (
	binding: SourceBinding
) => (
	getJson<unknown>(binding, '/api/v2/transfer/info')
		.then((response) => assertEnvelope(
			'transfer info',
			qBittorrentTransferInfoWire,
			response
		))
)

export const getTorrentFiles = (
	binding: SourceBinding,
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
	binding: SourceBinding,
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
	binding: SourceBinding,
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
	binding: SourceBinding,
	infoHash: string
) => (
	getJson<unknown>(binding, `/api/v2/torrents/trackers?hash=${encodeURIComponent(infoHash)}`)
		.then((response) => assertEnvelope(
			'torrent trackers',
			qBittorrentTorrentTrackerListWire,
			response
		))
)
