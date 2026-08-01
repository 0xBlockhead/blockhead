export type TorrentTrackerAnnounceRequest = {
	infoHash: string
	peerId: string
	port: number
	uploaded: number
	downloaded: number
	left: number
	event?: string
}
