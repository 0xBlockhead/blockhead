import { pipedApiGet } from '$/sources/Piped/Rest/client.ts'
import type {
	PipedChannelNextpage,
	PipedChannelTab,
	PipedChannel,
	PipedComment,
	PipedComments,
	PipedPlaylistNextpage,
	PipedPlaylistSummary,
	PipedPlaylist,
	PipedStreamItem,
	PipedStream,
} from '$/sources/Piped/Rest/types.ts'

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

export const getStream = (
	videoId: string
) => (
	pipedApiGet<PipedStream>(
		`/streams/${encodeURIComponent(videoId)}`
	)
)

export const getChannel = (
	channelId: string
) => (
	pipedApiGet<PipedChannel>(
		`/channel/${encodeURIComponent(channelId)}`
	)
)

export const listTrending = async (
	limit: number,
	region = 'US'
) => (
	sliceStreamItems(
		await pipedApiGet<PipedStreamItem[]>(
			'/trending',
			{ region }
		),
		limit
	)
)

export const getPlaylist = (
	playlistId: string
) => (
	pipedApiGet<PipedPlaylist>(
		`/playlists/${encodeURIComponent(playlistId)}`
	)
)

export const listPlaylistVideos = async (
	playlistId: string,
	limit: number,
	options?: {
		nextpage?: string
		playlist?: PipedPlaylist
	}
) => (
	options?.playlist != null && options.nextpage == null ?
		{
			items: sliceStreamItems(options.playlist.relatedStreams ?? [], limit),
			nextpage: options.playlist.nextpage,
		}
	: options?.nextpage != null ?
		(
			(page) => ({
				items: sliceStreamItems(page.relatedStreams ?? [], limit),
				nextpage: page.nextpage,
			})
		)(await pipedApiGet<PipedPlaylistNextpage>(
			`/nextpage/playlists/${encodeURIComponent(playlistId)}`,
			{ nextpage: options.nextpage }
		))
	:
		(
		(playlist) => ({
			items: sliceStreamItems(playlist.relatedStreams ?? [], limit),
			nextpage: playlist.nextpage,
		})
	)(await getPlaylist(playlistId))
)

export const getChannelTab = (
	data: string,
	nextpage?: string
) => (
	pipedApiGet<PipedChannelTab>(
		'/channels/tabs',
		{
			data,
			nextpage,
		}
	)
)

export const getComments = (
	videoId: string
) => (
	pipedApiGet<PipedComments>(
		`/comments/${encodeURIComponent(videoId)}`
	)
)

export const listComments = async (
	videoId: string,
	limit: number,
	options?: {
		nextpage?: string
	}
) => (
	options?.nextpage != null ?
		(
			(page) => ({
				comments: sliceComments(page.comments ?? [], limit),
				disabled: page.disabled,
				nextpage: page.nextpage,
			})
		)(await pipedApiGet<PipedComments>(
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
	)(await getComments(videoId))
)

export const listChannelPlaylists = async (
	channelId: string,
	limit: number,
	options?: {
		nextpage?: string
		tabData?: string
		channel?: PipedChannel
	}
) => {
	const tabData = (
		options?.tabData
		?? pipedPlaylistsTabDataFromChannel(
			options?.channel
			?? await getChannel(channelId)
		)
	)
	if (tabData == null) {
		return { items: [] }
	}
	const page = await getChannelTab(tabData, options?.nextpage)
	return {
		items: slicePlaylistSummaries(
			pipedPlaylistSummariesFromTabContent(page.content),
			limit
		),
		nextpage: page.nextpage,
	}
}

export const listChannelVideos = async (
	channelId: string,
	limit: number,
	options?: {
		nextpage?: string
		stream?: PipedStream
	}
) => (
	options?.stream != null && options.nextpage == null ?
		{
			items: sliceStreamItems(
				(options.stream.relatedStreams ?? [])
					.filter((item) => (
						getChannelIdFromUploaderUrl(item.uploaderUrl) === channelId
					)),
				limit
			),
			nextpage: undefined,
		}
	: options?.nextpage != null ?
		(
			(page) => ({
				items: sliceStreamItems(page.relatedStreams ?? [], limit),
				nextpage: page.nextpage,
			})
		)(await pipedApiGet<PipedChannelNextpage>(
			`/nextpage/channel/${encodeURIComponent(channelId)}`,
			{ nextpage: options.nextpage }
		))
	:
		(
		(channel) => ({
			items: sliceStreamItems(channel.relatedStreams ?? [], limit),
			nextpage: channel.nextpage,
		})
	)(await getChannel(channelId))
)
