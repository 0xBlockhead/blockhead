import type { MagnetUri } from '$/sources/MagnetUri/Uri/types.ts'


export const parseMagnetUri = (uri: string): MagnetUri => {
	const url = new URL(uri)
	if (url.protocol !== 'magnet:')
		throw new Error('MagnetUri_Uri: expected a magnet URI')

	const params = url.searchParams
	const displayName = params.get('dn')
	const exactLength = params.get('xl')
	const torrent = params.getAll('xt').flatMap((exactTopic) => {
		const bitTorrentV1Match = /^urn:btih:([0-9a-f]{40}|[a-z2-7]{32})$/i.exec(exactTopic)
		if (bitTorrentV1Match != null)
			return [{
				infoHash: bitTorrentV1Match[1].toLowerCase(),
				hashVersion: 'v1' as const,
			}]

		const bitTorrentV2Match = /^urn:btmh:1220([0-9a-f]{64})$/i.exec(exactTopic)
		return bitTorrentV2Match == null ? [] : [{
			infoHash: bitTorrentV2Match[1].toLowerCase(),
			hashVersion: 'v2' as const,
		}]
	})[0]
	if (exactLength != null && !/^(0|[1-9][0-9]*)$/.test(exactLength))
		throw new Error('MagnetUri_Uri: invalid exact length')

	return {
		uri,
		exactTopics: params.getAll('xt'),
		...(displayName != null && {
			displayName,
		}),
		...(exactLength != null && {
			exactLength: BigInt(exactLength),
		}),
		trackers: params.getAll('tr'),
		webSeeds: params.getAll('ws'),
		acceptableSources: params.getAll('as'),
		...(torrent != null && { torrent }),
	}
}
