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
const youtubeReplyPageLimit = 20
const youtubeReplyResponseLimit = 1_000

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
	limit: number,
	pageToken?: string
) => (
	youtubeApiV3Get<YoutubeApiPlaylistsListResponse>(
		publicEnv,
		'/playlists',
		{
			part: playlistParts,
			channelId,
			maxResults: String(clampYoutubeMaxResults(limit)),
			...(pageToken != null && { pageToken }),
		}
	)
)

export const listPlaylistItems = async (
	publicEnv: SourcePublicEnv,
	playlistId: string,
	limit: number,
	pageToken?: string
) => (
	youtubeApiV3Get<YoutubeApiPlaylistItemsListResponse>(
		publicEnv,
		'/playlistItems',
		{
			part: playlistItemParts,
			playlistId,
			maxResults: String(clampYoutubeMaxResults(limit)),
			...(pageToken != null && { pageToken }),
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

export const listCompleteCommentReplies = async (
	publicEnv: SourcePublicEnv,
	videoId: string,
	parentId: string,
	limit: number,
	pageToken?: string
) => {
	const boundedLimit = Math.min(youtubeReplyResponseLimit, Math.max(1, limit))
	const commentById = new Map<string, NonNullable<YoutubeApiCommentsListResponse['items']>[number]>()
	let nextPageToken = pageToken
	let totalReplyCount: number | undefined

	if (pageToken == null) {
		const thread = (await getCommentThread(publicEnv, parentId)).items?.[0]
		if (thread?.snippet?.videoId !== videoId)
			throw new Error('Youtube_Rest: comment thread does not belong to requested video')

		totalReplyCount = thread.snippet.totalReplyCount
		if (!Number.isSafeInteger(totalReplyCount) || totalReplyCount < 0)
			throw new Error('Youtube_Rest: comment thread reply count not found')

		for (const comment of thread.replies?.comments ?? []) {
			if (comment.snippet?.parentId !== parentId || comment.snippet.videoId !== videoId)
				throw new Error('Youtube_Rest: embedded reply does not belong to requested comment thread')
			if (comment.id != null && comment.id !== '')
				commentById.set(comment.id, comment)
		}

		if (commentById.size >= totalReplyCount)
			return {
				items: [...commentById.values()].slice(0, boundedLimit),
			}
	}

	for (let pageIndex = 0; pageIndex < youtubeReplyPageLimit; pageIndex++) {
		const page = await listCommentReplies(
			publicEnv,
			parentId,
			boundedLimit - commentById.size,
			nextPageToken
		)
		for (const comment of page.items ?? []) {
			if (comment.snippet?.parentId !== parentId || comment.snippet.videoId !== videoId)
				throw new Error('Youtube_Rest: reply does not belong to requested comment thread')
			if (comment.id != null && comment.id !== '')
				commentById.set(comment.id, comment)
		}
		nextPageToken = page.nextPageToken

		if (
			commentById.size >= boundedLimit
			|| totalReplyCount != null && commentById.size >= totalReplyCount
			|| nextPageToken == null
			|| nextPageToken === ''
		)
			return {
				items: [...commentById.values()].slice(0, boundedLimit),
				...(
					(totalReplyCount == null || commentById.size < totalReplyCount)
					&& nextPageToken != null
					&& nextPageToken !== ''
					&& { nextPageToken }
				),
			}
	}

	throw new Error('Youtube_Rest: comment reply page limit exceeded')
}

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
	limit: number,
	pageToken?: string
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
			...(pageToken != null && { pageToken }),
		}
	)
)
