import { youtubeApiV3Get } from '$/sources/Youtube/Rest/client.ts'
import type {
	YoutubeApiChannelsListWire,
	YoutubeApiCommentThreadsListWire,
	YoutubeApiCommentsListWire,
	YoutubeApiPlaylistItemsListWire,
	YoutubeApiPlaylistsListWire,
	YoutubeApiSearchListWire,
	YoutubeApiVideosListWire,
} from '$/sources/Youtube/Rest/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'

const channelParts = 'snippet,statistics'
const videoParts = 'snippet,statistics'
const playlistParts = 'snippet,contentDetails'
const playlistItemParts = 'snippet,contentDetails'
const commentThreadParts = 'snippet,replies'
const commentParts = 'snippet'

const clampYoutubeMaxResults = (limit: number) => (
	Math.min(50, Math.max(1, limit))
)

export const youtubeGetChannel = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	channelId: string,
) => (
	youtubeApiV3Get<YoutubeApiChannelsListWire>(
		publicEnv,
		'/channels',
		{
			part: channelParts,
			id: channelId,
		},
	)
)

export const youtubeGetVideo = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	videoId: string,
) => (
	youtubeApiV3Get<YoutubeApiVideosListWire>(
		publicEnv,
		'/videos',
		{
			part: videoParts,
			id: videoId,
		},
	)
)

export const youtubeGetComment = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	commentId: string,
) => (
	youtubeApiV3Get<YoutubeApiCommentsListWire>(
		publicEnv,
		'/comments',
		{
			part: commentParts,
			id: commentId,
		},
	)
)

export const youtubeGetPlaylist = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	playlistId: string,
) => (
	youtubeApiV3Get<YoutubeApiPlaylistsListWire>(
		publicEnv,
		'/playlists',
		{
			part: playlistParts,
			id: playlistId,
		},
	)
)

export const youtubeListChannelPlaylists = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	channelId: string,
	limit: number,
) => (
	youtubeApiV3Get<YoutubeApiPlaylistsListWire>(
		publicEnv,
		'/playlists',
		{
			part: playlistParts,
			channelId,
			maxResults: String(clampYoutubeMaxResults(limit)),
		},
	)
)

export const youtubeListPlaylistItems = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	playlistId: string,
	limit: number,
) => (
	youtubeApiV3Get<YoutubeApiPlaylistItemsListWire>(
		publicEnv,
		'/playlistItems',
		{
			part: playlistItemParts,
			playlistId,
			maxResults: String(clampYoutubeMaxResults(limit)),
		},
	)
)

export const youtubeListCommentThreads = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	videoId: string,
	limit: number,
) => (
	youtubeApiV3Get<YoutubeApiCommentThreadsListWire>(
		publicEnv,
		'/commentThreads',
		{
			part: commentThreadParts,
			videoId,
			maxResults: String(clampYoutubeMaxResults(limit)),
		},
	)
)

export const youtubeListCommentReplies = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	parentId: string,
	limit: number,
) => (
	youtubeApiV3Get<YoutubeApiCommentsListWire>(
		publicEnv,
		'/comments',
		{
			part: commentParts,
			parentId,
			maxResults: String(clampYoutubeMaxResults(limit)),
		},
	)
)

export const youtubeListPopularVideos = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	limit: number,
) => (
	youtubeApiV3Get<YoutubeApiVideosListWire>(
		publicEnv,
		'/videos',
		{
			part: videoParts,
			chart: 'mostPopular',
			maxResults: String(clampYoutubeMaxResults(limit)),
		},
	)
)

export const youtubeSearchChannels = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	query: string,
	limit: number,
) => (
	youtubeApiV3Get<YoutubeApiSearchListWire>(
		publicEnv,
		'/search',
		{
			part: 'snippet',
			type: 'channel',
			q: query,
			maxResults: String(clampYoutubeMaxResults(limit)),
		},
	)
)

export const youtubeSearchChannelVideos = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	channelId: string,
	limit: number,
) => (
	youtubeApiV3Get<YoutubeApiSearchListWire>(
		publicEnv,
		'/search',
		{
			part: 'snippet',
			type: 'video',
			channelId,
			order: 'date',
			maxResults: String(clampYoutubeMaxResults(limit)),
		},
	)
)
