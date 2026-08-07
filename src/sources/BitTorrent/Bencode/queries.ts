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

/** Fail-closed decode of an already-bdecoded metainfo dict. */
export const parseTorrentMetainfo = (
	decoded: unknown
): TorrentMetainfo => (
	assertEnvelope(
		'metainfo',
		torrentMetainfoWire,
		decoded
	)
)
