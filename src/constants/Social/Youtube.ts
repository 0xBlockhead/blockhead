import { YoutubeLiveBroadcastContent } from '$/schema/YoutubeVideo.ts'


// Constants
/** Channel `channelId` is YouTube’s opaque UC… id (not @handle). */
export const youtubeNetworkSeedChannels = [
	{
		channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
		title: 'Google for Developers',
	},
	{
		channelId: 'UCBR8-60-B28hp2BmDPdntcQ',
		title: 'YouTube Viewers',
	},
	{
		channelId: 'UCC5NfQ6Mf0dq_eEwv4P_hWA',
		title: 'jawed',
	},
] as const satisfies readonly {
	channelId: string
	title: string
}[]

/** Playlist `playlistId` is YouTube’s opaque PL… or channel uploads UU… id. */
export const youtubeNetworkSeedPlaylists = [
	{
		playlistId: 'UU_x5XG1OV2P6uZZ5FSM9Ttw',
		title: 'Google for Developers uploads',
		channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
	},
	{
		playlistId: 'UUUCBR8-60-B28hp2BmDPdntcQ',
		title: 'YouTube Viewers uploads',
		channelId: 'UCBR8-60-B28hp2BmDPdntcQ',
	},
] as const satisfies readonly {
	playlistId: string
	title: string
	channelId: string
}[]

/** Video `videoId` is YouTube’s 11-character id. */
export const youtubeNetworkSeedVideos = [
	{
		videoId: 'jNQXAC9IVRw',
		title: 'Me at the zoo',
		publishedAt: '2005-04-24T03:31:52Z',
		publishedAtMs: 1_114_314_712_000,
		thumbnailUrl: 'https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg',
		channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
	},
	{
		videoId: 'M7lc1UVf-VE',
		title: 'YouTube Developers Live: Embedded Web Player Customization',
		thumbnailUrl: 'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg',
		channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
	},
] as const satisfies readonly {
	videoId: string
	title: string
	publishedAt?: string
	publishedAtMs?: number
	thumbnailUrl: `https://${string}`
	channelId: string
}[]

const youTubeVideoLiveBroadcastPhases = [
	{
		liveBroadcastContent: YoutubeLiveBroadcastContent.None,
		label: 'None',
	},
	{
		liveBroadcastContent: YoutubeLiveBroadcastContent.Live,
		label: 'Live',
	},
	{
		liveBroadcastContent: YoutubeLiveBroadcastContent.Upcoming,
		label: 'Upcoming',
	},
] as const satisfies readonly {
	liveBroadcastContent: YoutubeLiveBroadcastContent
	label: string
}[]

const youTubeVideoCategories = [
	{
		categoryId: '1',
		label: 'Film & Animation',
	},
	{
		categoryId: '2',
		label: 'Autos & Vehicles',
	},
	{
		categoryId: '10',
		label: 'Music',
	},
	{
		categoryId: '15',
		label: 'Pets & Animals',
	},
	{
		categoryId: '17',
		label: 'Sports',
	},
	{
		categoryId: '19',
		label: 'Travel & Events',
	},
	{
		categoryId: '20',
		label: 'Gaming',
	},
	{
		categoryId: '22',
		label: 'People & Blogs',
	},
	{
		categoryId: '23',
		label: 'Comedy',
	},
	{
		categoryId: '24',
		label: 'Entertainment',
	},
	{
		categoryId: '25',
		label: 'News & Politics',
	},
	{
		categoryId: '26',
		label: 'Howto & Style',
	},
	{
		categoryId: '27',
		label: 'Education',
	},
	{
		categoryId: '28',
		label: 'Science & Technology',
	},
] as const satisfies readonly {
	categoryId: string
	label: string
}[]


// Lookups

export const youTubeVideoLiveBroadcastPhaseByLiveBroadcastContent = Object.fromEntries(
	youTubeVideoLiveBroadcastPhases.map((row) => [
		row.liveBroadcastContent,
		row,
	])
)

export const youTubeVideoCategoryByCategoryId = Object.fromEntries(
	youTubeVideoCategories.map((row) => [
		row.categoryId,
		row,
	])
)

export const youtubeNetworkSeedChannelByChannelId = Object.fromEntries(
	youtubeNetworkSeedChannels.map((channel) => [
		channel.channelId,
		channel,
	])
)

export const youtubeNetworkSeedPlaylistByPlaylistId = Object.fromEntries(
	youtubeNetworkSeedPlaylists.map((playlist) => [
		playlist.playlistId,
		playlist,
	])
)

export const youtubeNetworkSeedVideoByVideoId = Object.fromEntries(
	youtubeNetworkSeedVideos.map((video) => [
		video.videoId,
		video,
	])
)
