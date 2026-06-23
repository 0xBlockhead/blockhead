import { pipedApiGet } from '$/sources/Piped/Rest/client.ts'
import type {
	PipedChannelNextpage,
	PipedChannelTab,
	PipedChannel,
	PipedComment,
	PipedComments,
	PipedListChannelPlaylists,
	PipedListChannelVideos,
	PipedListPlaylistVideos,
	PipedPlaylistNextpage,
	PipedPlaylistSummary,
	PipedPlaylist,
	PipedStreamItem,
	PipedStream,
} from '$/sources/Piped/Rest/types.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'

const clampPipedLimit = (limit: number) => (
	Math.min(100, Math.max(1, limit))
)

export const getChannelIdFromUploaderUrl = (uploaderUrl: string | undefined) => (
	uploaderUrl?.match(/\/channel\/([^/?]+)/)?.[1]
)

export const getVideoIdFromUrl = (url: string | undefined) => (
	url?.match(/[?&]v=([^&]+)/)?.[1]
	?? url?.match(/\/shorts\/([^/?]+)/)?.[1]
)

export const getPlaylistIdFromUrl = (url: string | undefined) => (
	url?.match(/[?&]list=([^&]+)/)?.[1]
)

const sliceStreamItems = (
	items: readonly PipedStreamItem[],
	limit: number
) => (
	items.slice(0, clampPipedLimit(limit))
)

const sliceComments = (
	items: readonly PipedComment[],
	limit: number
) => (
	items.slice(0, clampPipedLimit(limit))
)

const slicePlaylistSummaries = (
	items: readonly PipedPlaylistSummary[],
	limit: number
) => (
	items.slice(0, clampPipedLimit(limit))
)

const pipedPlaylistsTabDataFromChannel = (channel: PipedChannel) => (
	channel.tabs?.find((tab) => (
		tab.name === 'playlists'
	))?.data
)

const pipedPlaylistSummariesFromTabContent = (
	content: readonly PipedPlaylistSummary[] | undefined
) => (
	(content ?? [])
		.filter((item) => (
			item.type === 'playlist'
			|| getPlaylistIdFromUrl(item.url) != null
		))
)

export const getStream = async (
	publicEnv: SourcePublicEnv,
	videoId: string
) => (
	pipedApiGet<PipedStream>(
		publicEnv,
		`/streams/${encodeURIComponent(videoId)}`
	)
)

export const getChannel = async (
	publicEnv: SourcePublicEnv,
	channelId: string
) => (
	pipedApiGet<PipedChannel>(
		publicEnv,
		`/channel/${encodeURIComponent(channelId)}`
	)
)

export const listTrending = async (
	publicEnv: SourcePublicEnv,
	limit: number,
	region = 'US'
) => (
	sliceStreamItems(
		await pipedApiGet<PipedStreamItem[]>(
			publicEnv,
			'/trending',
			{ region }
		),
		limit
	)
)

export const getPlaylist = async (
	publicEnv: SourcePublicEnv,
	playlistId: string
) => (
	pipedApiGet<PipedPlaylist>(
		publicEnv,
		`/playlists/${encodeURIComponent(playlistId)}`
	)
)

export const listPlaylistVideos = async (
	publicEnv: SourcePublicEnv,
	playlistId: string,
	limit: number,
	options?: {
		nextpage?: string
		playlist?: PipedPlaylist
	}
): Promise<PipedListPlaylistVideos> => (
	options?.playlist != null && options.nextpage == null ?
		{
			items: sliceStreamItems(options.playlist.relatedStreams ?? [], limit),
		}
	: options?.nextpage != null ?
		(
			(page) => ({
				items: sliceStreamItems(page.relatedStreams ?? [], limit),
				nextpage: page.nextpage,
			})
		)(await pipedApiGet<PipedPlaylistNextpage>(
			publicEnv,
			`/nextpage/playlists/${encodeURIComponent(playlistId)}`,
			{ nextpage: options.nextpage }
		))
	:
		(
		(playlist) => ({
			items: sliceStreamItems(playlist.relatedStreams ?? [], limit),
			nextpage: playlist.nextpage,
		})
	)(await getPlaylist(publicEnv, playlistId))
)

export const getChannelTab = async (
	publicEnv: SourcePublicEnv,
	data: string,
	nextpage?: string
) => (
	pipedApiGet<PipedChannelTab>(
		publicEnv,
		'/channels/tabs',
		{
			data,
			nextpage,
		}
	)
)

export const getComments = async (
	publicEnv: SourcePublicEnv,
	videoId: string
) => (
	pipedApiGet<PipedComments>(
		publicEnv,
		`/comments/${encodeURIComponent(videoId)}`
	)
)

export const listComments = async (
	publicEnv: SourcePublicEnv,
	videoId: string,
	limit: number,
	options?: {
		nextpage?: string
	}
): Promise<PipedComments> => (
	options?.nextpage != null ?
		(
			(page) => ({
				comments: sliceComments(page.comments ?? [], limit),
				disabled: page.disabled,
				nextpage: page.nextpage,
			})
		)(await pipedApiGet<PipedComments>(
			publicEnv,
			`/nextpage/comments/${encodeURIComponent(videoId)}`,
			{ nextpage: options.nextpage }
		))
	:
		(
		(page) => ({
			comments: sliceComments(page.comments ?? [], limit),
			disabled: page.disabled,
			nextpage: page.nextpage,
		})
	)(await getComments(publicEnv, videoId))
)

export const listChannelPlaylists = async (
	publicEnv: SourcePublicEnv,
	channelId: string,
	limit: number,
	options?: {
		nextpage?: string
		tabData?: string
		channel?: PipedChannel
	}
): Promise<PipedListChannelPlaylists> => {
	const tabData = (
		options?.tabData
		?? pipedPlaylistsTabDataFromChannel(
			options?.channel
			?? await getChannel(publicEnv, channelId)
		)
	)
	if (tabData == null) {
		return { items: [] }
	}
	const page = await getChannelTab(publicEnv, tabData, options?.nextpage)
	return {
		items: slicePlaylistSummaries(
			pipedPlaylistSummariesFromTabContent(page.content),
			limit
		),
		nextpage: page.nextpage,
	}
}

export const listChannelVideos = async (
	publicEnv: SourcePublicEnv,
	channelId: string,
	limit: number,
	options?: {
		nextpage?: string
		stream?: PipedStream
	}
): Promise<PipedListChannelVideos> => (
	options?.stream != null && options.nextpage == null ?
		{
			items: sliceStreamItems(
				(options.stream.relatedStreams ?? [])
					.filter((item) => (
						getChannelIdFromUploaderUrl(item.uploaderUrl) === channelId
					)),
				limit
			),
		}
	: options?.nextpage != null ?
		(
			(page) => ({
				items: sliceStreamItems(page.relatedStreams ?? [], limit),
				nextpage: page.nextpage,
			})
		)(await pipedApiGet<PipedChannelNextpage>(
			publicEnv,
			`/nextpage/channel/${encodeURIComponent(channelId)}`,
			{ nextpage: options.nextpage }
		))
	:
		(
		(channel) => ({
			items: sliceStreamItems(channel.relatedStreams ?? [], limit),
			nextpage: channel.nextpage,
		})
	)(await getChannel(publicEnv, channelId))
)
