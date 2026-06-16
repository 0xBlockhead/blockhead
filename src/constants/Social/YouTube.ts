import { YouTubeLiveBroadcastContent } from '$/schema/YouTubeVideo.ts'


// Constants
/** Channel `channelId` is YouTube’s opaque UC… id (not @handle). */
export const youtubeNetworkSeedChannels = [
	{
		channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
	},
	{
		channelId: 'UCBR8-60-B28hp2BmDPdntcQ',
	},
] as const satisfies readonly {
	channelId: string
}[]

/** Playlist `playlistId` is YouTube’s opaque PL… or channel uploads UU… id. */
export const youtubeNetworkSeedPlaylists = [
	{
		playlistId: 'UU_x5XG1OV2P6uZZ5FSM9Ttw',
	},
	{
		playlistId: 'UUUCBR8-60-B28hp2BmDPdntcQ',
	},
] as const satisfies readonly {
	playlistId: string
}[]

/** Video `videoId` is YouTube’s 11-character id. */
export const youtubeNetworkSeedVideos = [
	{
		videoId: 'jNQXAC9IVRw',
	},
	{
		videoId: 'M7lc1UVf-VE',
	},
] as const satisfies readonly {
	videoId: string
}[]

const youTubeVideoLiveBroadcastPhases = [
	{
		liveBroadcastContent: YouTubeLiveBroadcastContent.None,
		label: 'None',
	},
	{
		liveBroadcastContent: YouTubeLiveBroadcastContent.Live,
		label: 'Live',
	},
	{
		liveBroadcastContent: YouTubeLiveBroadcastContent.Upcoming,
		label: 'Upcoming',
	},
] as const satisfies readonly {
	liveBroadcastContent: YouTubeLiveBroadcastContent
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
