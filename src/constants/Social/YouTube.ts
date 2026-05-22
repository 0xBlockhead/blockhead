// Types
import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'


// Constants
export const youtubeNetworkFieldValues = {
	docsUrl: 'https://developers.google.com/youtube/v3',
	homeUrl: 'https://www.youtube.com',
	protocolName: 'YouTube Data API',
	registryLabel: 'Curated seed channels + live channel uploads',
	topology: 'Constants seeds + live REST -> network -> channels / playlists -> videos',
} as const

/** Channel `channelId` is YouTube’s opaque UC… id (not @handle). */
export const youtubeNetworkSeedChannels: readonly EntityId<typeof schema, EntityType.YouTubeChannel>[] = [
	{
		channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
	},
	{
		channelId: 'UCBR8-60-B28hp2BmDPdntcQ',
	},
]

/** Playlist `playlistId` is YouTube’s opaque PL… or channel uploads UU… id. */
export const youtubeNetworkSeedPlaylists: readonly EntityId<typeof schema, EntityType.YouTubePlaylist>[] = [
	{
		playlistId: 'UU_x5XG1OV2P6uZZ5FSM9Ttw',
	},
	{
		playlistId: 'UUUCBR8-60-B28hp2BmDPdntcQ',
	},
]

/** Video `videoId` is YouTube’s 11-character id. */
export const youtubeNetworkSeedVideos: readonly EntityId<typeof schema, EntityType.YouTubeVideo>[] = [
	{
		videoId: 'jNQXAC9IVRw',
	},
	{
		videoId: 'M7lc1UVf-VE',
	},
]
