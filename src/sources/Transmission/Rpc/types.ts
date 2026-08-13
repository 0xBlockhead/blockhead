import {
	type as arktype,
	type Type,
} from 'arktype'

import type { JsonValue } from '$/typescript/JsonValue.ts'


export type TransmissionRequest = {
	method: string
	arguments?: Record<string, JsonValue>
	tag?: number
}

export type TransmissionResponse<_Arguments extends JsonValue = JsonValue> = {
	result: string
	arguments?: _Arguments
	tag?: number
}

export type TransmissionSession = {
	'version'?: string
	'peer-port'?: number
	'download-dir'?: string
	'bind-address-ipv4'?: string
	'bind-address-ipv6'?: string
}

export type TransmissionSessionStats = {
	'activeTorrentCount'?: number
	'downloadSpeed'?: number
	'uploadSpeed'?: number
	'torrentCount'?: number
	'cumulative-stats'?: {
		downloadedBytes?: number
		uploadedBytes?: number
	}
}

export type TransmissionTorrentFile = {
	name: string
	length: number
	bytesCompleted?: number
}

export type TransmissionTorrentFileStats = {
	wanted?: boolean
	priority?: number
	bytesCompleted?: number
}

export type TransmissionTorrentPeer = {
	address: string
	port: number
	clientName?: string
	progress?: number
}

export type TransmissionTorrent = {
	hashString: string
	name?: string
	status?: number
	downloadDir?: string
	downloadedEver?: number
	uploadedEver?: number
	rateDownload?: number
	rateUpload?: number
	peersConnected?: number
	queuePosition?: number
	uploadRatio?: number
	errorString?: string
	pieceCount?: number
	pieceSize?: number
	totalSize?: number
	files?: TransmissionTorrentFile[]
	fileStats?: TransmissionTorrentFileStats[]
	peers?: TransmissionTorrentPeer[]
}

export type TransmissionTorrents = {
	torrents: TransmissionTorrent[]
}


const nonNegativeInteger = arktype('number.integer >= 0')
const nonNegativeNumber = arktype('number >= 0')
const transmissionSessionWire = arktype({
	'version?': 'string',
	'peer-port?': nonNegativeInteger,
	'download-dir?': 'string',
	'bind-address-ipv4?': 'string',
	'bind-address-ipv6?': 'string',
}) satisfies Type<TransmissionSession>
const transmissionSessionStatsWire = arktype({
	'activeTorrentCount?': nonNegativeInteger,
	'downloadSpeed?': nonNegativeInteger,
	'uploadSpeed?': nonNegativeInteger,
	'torrentCount?': nonNegativeInteger,
	'cumulative-stats?': {
		'downloadedBytes?': nonNegativeInteger,
		'uploadedBytes?': nonNegativeInteger,
	},
}) satisfies Type<TransmissionSessionStats>
const transmissionTorrentFileWire = arktype({
	name: 'string',
	length: nonNegativeInteger,
	'bytesCompleted?': nonNegativeInteger,
}) satisfies Type<TransmissionTorrentFile>
const transmissionTorrentFileStatsWire = arktype({
	'wanted?': 'boolean',
	'priority?': 'number.integer',
	'bytesCompleted?': nonNegativeInteger,
}) satisfies Type<TransmissionTorrentFileStats>
const transmissionTorrentPeerWire = arktype({
	address: 'string > 0',
	port: 'number.integer >= 0 <= 65535',
	'clientName?': 'string',
	'progress?': 'number >= 0 <= 1',
}) satisfies Type<TransmissionTorrentPeer>
const transmissionTorrentWire = arktype({
	hashString: 'string',
	'name?': 'string',
	'status?': '0 <= number.integer <= 6',
	'downloadDir?': 'string',
	'downloadedEver?': nonNegativeInteger,
	'uploadedEver?': nonNegativeInteger,
	'rateDownload?': nonNegativeInteger,
	'rateUpload?': nonNegativeInteger,
	'peersConnected?': nonNegativeInteger,
	'queuePosition?': nonNegativeInteger,
	'uploadRatio?': nonNegativeNumber,
	'errorString?': 'string',
	'pieceCount?': nonNegativeInteger,
	'pieceSize?': nonNegativeInteger,
	'totalSize?': nonNegativeInteger,
	'files?': transmissionTorrentFileWire.array(),
	'fileStats?': transmissionTorrentFileStatsWire.array(),
	'peers?': transmissionTorrentPeerWire.array(),
}) satisfies Type<TransmissionTorrent>

const response = <_Arguments extends JsonValue>(
	argumentsWire: Type<_Arguments>
) => arktype({
	result: 'string',
	'arguments?': argumentsWire,
	'tag?': 'number.integer',
})

export const transmissionSessionResponseWire = response(transmissionSessionWire)
export const transmissionSessionStatsResponseWire = response(transmissionSessionStatsWire)
export const transmissionTorrentsResponseWire = response(arktype({
	torrents: transmissionTorrentWire.array(),
}) satisfies Type<TransmissionTorrents>)
