import type { BencodeValue as SourceBencodeValue } from '$/sources/_shared/wire/Bencode/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export type BencodeValue = SourceBencodeValue

export type TorrentMetainfoSummary = {
	byteLength: number
}

export type TorrentTrackerAnnounceRequest = {
	infoHash: string
	peerId: string
	port: number
	uploaded: number
	downloaded: number
	left: number
	event?: string
}

export type TorrentWireJson = JsonValue
