import { youtubeApiV3Get } from '$/sources/Youtube/Rest/client.ts'
import type {
	YoutubeApiChannelsListResponse,
	YoutubeApiCommentThreadsListResponse,
	YoutubeApiCommentsListResponse,
	YoutubeApiPlaylistItemsListResponse,
	YoutubeApiPlaylistsListResponse,
	YoutubeApiSearchListResponse,
	YoutubeApiVideosListResponse,
} from '$/sources/Youtube/Rest/types.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'

const channelParts = 'snippet,statistics'
const videoParts = 'snippet,statistics,contentDetails'
const playlistParts = 'snippet,contentDetails'
const playlistItemParts = 'snippet,contentDetails'
const commentThreadParts = 'snippet,replies'
const commentParts = 'snippet'

const clampYoutubeMaxResults = (limit: number) => (
	Math.min(50, Math.max(1, limit))
)

export const getChannel = async (
	publicEnv: SourcePublicEnv,
	channelId: string
) => (
	youtubeApiV3Get<YoutubeApiChannelsListResponse>(
		publicEnv,
		'/channels',
		{
			part: channelParts,
			id: channelId,
		}
	)
)

export const getVideo = async (
	publicEnv: SourcePublicEnv,
	videoId: string
) => (
	youtubeApiV3Get<YoutubeApiVideosListResponse>(
		publicEnv,
		'/videos',
		{
			part: videoParts,
			id: videoId,
		}
	)
)

export const getComment = async (
	publicEnv: SourcePublicEnv,
	commentId: string
) => (
	youtubeApiV3Get<YoutubeApiCommentsListResponse>(
		publicEnv,
		'/comments',
		{
			part: commentParts,
			id: commentId,
		}
	)
)

export const getCommentThread = async (
	publicEnv: SourcePublicEnv,
	commentThreadId: string
) => (
	youtubeApiV3Get<YoutubeApiCommentThreadsListResponse>(
		publicEnv,
		'/commentThreads',
		{
			part: commentThreadParts,
			id: commentThreadId,
		}
	)
)

export const getPlaylist = async (
	publicEnv: SourcePublicEnv,
	playlistId: string
) => (
	youtubeApiV3Get<YoutubeApiPlaylistsListResponse>(
		publicEnv,
		'/playlists',
		{
			part: playlistParts,
			id: playlistId,
		}
	)
)

export const listChannelPlaylists = async (
	publicEnv: SourcePublicEnv,
	channelId: string,
	limit: number
) => (
	youtubeApiV3Get<YoutubeApiPlaylistsListResponse>(
		publicEnv,
		'/playlists',
		{
			part: playlistParts,
			channelId,
			maxResults: String(clampYoutubeMaxResults(limit)),
		}
	)
)

export const listPlaylistItems = async (
	publicEnv: SourcePublicEnv,
	playlistId: string,
	limit: number
) => (
	youtubeApiV3Get<YoutubeApiPlaylistItemsListResponse>(
		publicEnv,
		'/playlistItems',
		{
			part: playlistItemParts,
			playlistId,
			maxResults: String(clampYoutubeMaxResults(limit)),
		}
	)
)

export const listCommentThreads = async (
	publicEnv: SourcePublicEnv,
	videoId: string,
	limit: number,
	pageToken?: string
) => (
	youtubeApiV3Get<YoutubeApiCommentThreadsListResponse>(
		publicEnv,
		'/commentThreads',
		{
			part: commentThreadParts,
			videoId,
			maxResults: String(clampYoutubeMaxResults(limit)),
			...(pageToken != null && { pageToken }),
		}
	)
)

export const listCommentReplies = async (
	publicEnv: SourcePublicEnv,
	parentId: string,
	limit: number,
	pageToken?: string
) => (
	youtubeApiV3Get<YoutubeApiCommentsListResponse>(
		publicEnv,
		'/comments',
		{
			part: commentParts,
			parentId,
			maxResults: String(clampYoutubeMaxResults(limit)),
			...(pageToken != null && { pageToken }),
		}
	)
)

export const listPopularVideos = async (
	publicEnv: SourcePublicEnv,
	limit: number
) => (
	youtubeApiV3Get<YoutubeApiVideosListResponse>(
		publicEnv,
		'/videos',
		{
			part: videoParts,
			chart: 'mostPopular',
			maxResults: String(clampYoutubeMaxResults(limit)),
		}
	)
)

export const searchChannels = async (
	publicEnv: SourcePublicEnv,
	query: string,
	limit: number
) => (
	youtubeApiV3Get<YoutubeApiSearchListResponse>(
		publicEnv,
		'/search',
		{
			part: 'snippet',
			type: 'channel',
			q: query,
			maxResults: String(clampYoutubeMaxResults(limit)),
		}
	)
)

export const searchChannelVideos = async (
	publicEnv: SourcePublicEnv,
	channelId: string,
	limit: number
) => (
	youtubeApiV3Get<YoutubeApiSearchListResponse>(
		publicEnv,
		'/search',
		{
			part: 'snippet',
			type: 'video',
			channelId,
			order: 'date',
			maxResults: String(clampYoutubeMaxResults(limit)),
		}
	)
)
