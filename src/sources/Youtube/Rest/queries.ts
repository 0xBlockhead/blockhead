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
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'

const channelParts = 'snippet,statistics'
const videoParts = 'snippet,statistics,contentDetails'
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
	youtubeApiV3Get<YoutubeApiChannelsListResponse>(
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
	youtubeApiV3Get<YoutubeApiVideosListResponse>(
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
	youtubeApiV3Get<YoutubeApiCommentsListResponse>(
		publicEnv,
		'/comments',
		{
			part: commentParts,
			id: commentId,
		},
	)
)

export const youtubeGetCommentThread = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	commentThreadId: string,
) => (
	youtubeApiV3Get<YoutubeApiCommentThreadsListResponse>(
		publicEnv,
		'/commentThreads',
		{
			part: commentThreadParts,
			id: commentThreadId,
		},
	)
)

export const youtubeGetPlaylist = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	playlistId: string,
) => (
	youtubeApiV3Get<YoutubeApiPlaylistsListResponse>(
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
	youtubeApiV3Get<YoutubeApiPlaylistsListResponse>(
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
	youtubeApiV3Get<YoutubeApiPlaylistItemsListResponse>(
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
	pageToken?: string,
) => (
	youtubeApiV3Get<YoutubeApiCommentThreadsListResponse>(
		publicEnv,
		'/commentThreads',
		{
			part: commentThreadParts,
			videoId,
			maxResults: String(clampYoutubeMaxResults(limit)),
			...(pageToken != null && { pageToken }),
		},
	)
)

export const youtubeListCommentReplies = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	parentId: string,
	limit: number,
	pageToken?: string,
) => (
	youtubeApiV3Get<YoutubeApiCommentsListResponse>(
		publicEnv,
		'/comments',
		{
			part: commentParts,
			parentId,
			maxResults: String(clampYoutubeMaxResults(limit)),
			...(pageToken != null && { pageToken }),
		},
	)
)

export const youtubeListPopularVideos = async (
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	limit: number,
) => (
	youtubeApiV3Get<YoutubeApiVideosListResponse>(
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
	youtubeApiV3Get<YoutubeApiSearchListResponse>(
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
	youtubeApiV3Get<YoutubeApiSearchListResponse>(
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
