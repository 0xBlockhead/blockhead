import { pipedApiGet } from '$/sources/Piped/Rest/client.ts'
import {
	pipedChannelNextpageWire,
	pipedChannelTabWire,
	pipedChannelWire,
	pipedCommentsWire,
	pipedPlaylistNextpageWire,
	pipedPlaylistWire,
	pipedStreamItemListWire,
	pipedStreamWire,
	type PipedChannel,
	type PipedComment,
	type PipedPlaylist,
	type PipedPlaylistSummary,
	type PipedStream,
	type PipedStreamItem,
} from '$/sources/Piped/Rest/types.ts'

const clampPipedLimit = (limit: number) => (
	Math.min(100, Math.max(1, limit))
)

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Piped_Rest: invalid ${label} response envelope`)
	}
}

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
	videoId: string
) => (
	assertEnvelope(
		'stream',
		pipedStreamWire,
		await pipedApiGet<unknown>(
			`/streams/${encodeURIComponent(videoId)}`
		)
	)
)

export const getChannel = async (
	channelId: string
) => (
	assertEnvelope(
		'channel',
		pipedChannelWire,
		await pipedApiGet<unknown>(
			`/channel/${encodeURIComponent(channelId)}`
		)
	)
)

export const listTrending = async (
	limit: number,
	region = 'US'
) => (
	sliceStreamItems(
		assertEnvelope(
			'trending',
			pipedStreamItemListWire,
			await pipedApiGet<unknown>(
				'/trending',
				{ region }
			)
		),
		limit
	)
)

export const getPlaylist = async (
	playlistId: string
) => (
	assertEnvelope(
		'playlist',
		pipedPlaylistWire,
		await pipedApiGet<unknown>(
			`/playlists/${encodeURIComponent(playlistId)}`
		)
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
		)(assertEnvelope(
			'playlist-nextpage',
			pipedPlaylistNextpageWire,
			await pipedApiGet<unknown>(
				`/nextpage/playlists/${encodeURIComponent(playlistId)}`,
				{ nextpage: options.nextpage }
			)
		))
	:
		(
		(playlist) => ({
			items: sliceStreamItems(playlist.relatedStreams ?? [], limit),
			nextpage: playlist.nextpage,
		})
	)(await getPlaylist(playlistId))
)

export const getChannelTab = async (
	data: string,
	nextpage?: string
) => (
	assertEnvelope(
		'channel-tab',
		pipedChannelTabWire,
		await pipedApiGet<unknown>(
			'/channels/tabs',
			{
				data,
				nextpage,
			}
		)
	)
)

export const getComments = async (
	videoId: string
) => (
	assertEnvelope(
		'comments',
		pipedCommentsWire,
		await pipedApiGet<unknown>(
			`/comments/${encodeURIComponent(videoId)}`
		)
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
		)(assertEnvelope(
			'comments-nextpage',
			pipedCommentsWire,
			await pipedApiGet<unknown>(
				`/nextpage/comments/${encodeURIComponent(videoId)}`,
				{ nextpage: options.nextpage }
			)
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
		return { items: [] as PipedPlaylistSummary[] }
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
		)(assertEnvelope(
			'channel-nextpage',
			pipedChannelNextpageWire,
			await pipedApiGet<unknown>(
				`/nextpage/channel/${encodeURIComponent(channelId)}`,
				{ nextpage: options.nextpage }
			)
		))
	:
		(
		(channel) => ({
			items: sliceStreamItems(channel.relatedStreams ?? [], limit),
			nextpage: channel.nextpage,
		})
	)(await getChannel(channelId))
)
