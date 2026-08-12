export type MagnetUri = {
	uri: string
	exactTopics: string[]
	displayName?: string
	exactLength?: bigint
	trackers: string[]
	webSeeds: string[]
	acceptableSources: string[]
	torrent?: {
		infoHash: string
		hashVersion: 'v1' | 'v2'
	}
}
