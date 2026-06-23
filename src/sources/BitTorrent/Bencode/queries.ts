import type {
	TorrentMetainfoSummary,
	TorrentTrackerAnnounceRequest,
} from '$/sources/BitTorrent/Bencode/types.ts'

export const summarizeMetainfo = (
	bytes: Uint8Array
) => ({
	byteLength: bytes.byteLength,
}) satisfies TorrentMetainfoSummary

export const httpTrackerAnnounceSearchParams = ({
	infoHash,
	peerId,
	port,
	uploaded,
	downloaded,
	left,
	event,
}: TorrentTrackerAnnounceRequest) => (
	new URLSearchParams({
		info_hash: infoHash,
		peer_id: peerId,
		port: String(port),
		uploaded: String(uploaded),
		downloaded: String(downloaded),
		left: String(left),
		...(event != null && { event }),
	})
)
