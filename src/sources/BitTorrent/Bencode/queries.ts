import {
	torrentTrackerAnnounceRequestWire,
	type TorrentTrackerAnnounceRequest,
	type TorrentTrackerAnnounceResponse,
	torrentTrackerAnnounceResponseWire,
	type TorrentMetainfo,
	torrentMetainfoWire,
} from '$/sources/BitTorrent/Bencode/types.ts'

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	value: unknown
) => {
	try {
		return wire.assert(value)
	} catch {
		throw new Error(`BitTorrent: invalid ${label} bencode envelope`)
	}
}

export const httpTrackerAnnounceSearchParams = (
	request: TorrentTrackerAnnounceRequest
) => {
	const asserted = assertEnvelope(
		'announce request',
		torrentTrackerAnnounceRequestWire,
		request
	)
	return new URLSearchParams({
		info_hash: asserted.infoHash,
		peer_id: asserted.peerId,
		port: String(asserted.port),
		uploaded: String(asserted.uploaded),
		downloaded: String(asserted.downloaded),
		left: String(asserted.left),
		...(asserted.event != null && { event: asserted.event }),
	})
}

/** Fail-closed decode of an already-bdecoded tracker announce dict. */
export const parseTrackerAnnounceResponse = (
	decoded: unknown
): TorrentTrackerAnnounceResponse => (
	assertEnvelope(
		'announce response',
		torrentTrackerAnnounceResponseWire,
		decoded
	)
)

const assertTorrentMetainfoIntegrity = (
	metainfo: TorrentMetainfo
) => {
	const {
		info,
	} = metainfo
	if (!(info.pieces instanceof Uint8Array) || info.pieces.byteLength % 20 !== 0)
		throw new Error('BitTorrent: metainfo pieces must be concatenated 20-byte hashes')
	if (!Number.isSafeInteger(info['piece length']))
		throw new Error('BitTorrent: metainfo piece length exceeds the safe integer range')

	let totalLength: number
	if (info.length != null) {
		if (info.files != null)
			throw new Error('BitTorrent: metainfo must have either length or files')
		if (!Number.isSafeInteger(info.length))
			throw new Error('BitTorrent: metainfo length exceeds the safe integer range')
		totalLength = info.length
	} else {
		if (info.files == null || info.files.length === 0)
			throw new Error('BitTorrent: metainfo must have either length or files')
		if (info.files.some((file) => (
			!Number.isSafeInteger(file.length)
			|| file.path.length === 0
			|| file.path.some((segment) => (
				segment === ''
				|| segment === '.'
				|| segment === '..'
			))
		)))
			throw new Error('BitTorrent: metainfo has an invalid file entry')
		totalLength = info.files.reduce((length, file) => length + file.length, 0)
		if (!Number.isSafeInteger(totalLength))
			throw new Error('BitTorrent: metainfo total length exceeds the safe integer range')
	}
	if (Math.ceil(totalLength / info['piece length']) !== info.pieces.byteLength / 20)
		throw new Error('BitTorrent: metainfo piece hash count does not match content length')

	return metainfo
}

/** Fail-closed decode of an already-bdecoded metainfo dict. */
export const parseTorrentMetainfo = (
	decoded: unknown
): TorrentMetainfo => (
	assertTorrentMetainfoIntegrity(
		assertEnvelope(
			'metainfo',
			torrentMetainfoWire,
			decoded
		)
	)
)
