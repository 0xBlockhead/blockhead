import { pipedApiGet } from '$/sources/Piped/Rest/client.ts'
import type {
	PipedChannelNextpageWire,
	PipedChannelTabWire,
	PipedChannelWire,
	PipedCommentWire,
	PipedCommentsWire,
	PipedListChannelPlaylistsWire,
	PipedListChannelVideosWire,
	PipedListPlaylistVideosWire,
	PipedPlaylistNextpageWire,
	PipedPlaylistSummaryWire,
	PipedPlaylistWire,
	PipedStreamItemWire,
	PipedStreamWire,
} from '$/sources/Piped/Rest/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'

const clampPipedLimit = (limit: number) => (
	Math.min(100, Math.max(1, limit))
)

export const pipedChannelIdFromUploaderUrl = (uploaderUrl: string | undefined) => (
	uploaderUrl?.match(/\/channel\/([^/?]+)/)?.[1]
)

export const pipedVideoIdFromUrl = (url: string | undefined) => (
	url?.match(/[?&]v=([^&]+)/)?.[1]
	?? url?.match(/\/shorts\/([^/?]+)/)?.[1]
)

export const pipedPlaylistIdFromUrl = (url: string | undefined) => (
	url?.match(/[?&]list=([^&]+)/)?.[1]
)

const sliceStreamItems = (
	items: readonly PipedStreamItemWire[],
	limit: number,
) => (
	items.slice(0, clampPipedLimit(limit))
)

const sliceComments = (
	items: readonly PipedCommentWire[],
	limit: number,
) => (
	items.slice(0, clampPipedLimit(limit))
)

const slicePlaylistSummaries = (
	items: readonly PipedPlaylistSummaryWire[],
	limit: number,
) => (
	items.slice(0, clampPipedLimit(limit))
)

const pipedPlaylistsTabDataFromChannel = (channel: PipedChannelWire) => (
	channel.tabs?.find((tab) => (
		tab.name === 'playlists'
	))?.data
)

const pipedPlaylistSummariesFromTabContent = (
	content: readonly PipedPlaylistSummaryWire[] | undefined,
) => (
	(content ?? [])
		.filter((item) => (
			item.type === 'playlist'
			|| pipedPlaylistIdFromUrl(item.url) != null
		))
)

export const pipedGetStream = async (
	publicEnv: SourcePublicEnvFor<Source.Piped_Rest>,
	videoId: string,
) => (
	pipedApiGet<PipedStreamWire>(
		publicEnv,
		`/streams/${encodeURIComponent(videoId)}`,
	)
)

export const pipedGetChannel = async (
	publicEnv: SourcePublicEnvFor<Source.Piped_Rest>,
	channelId: string,
) => (
	pipedApiGet<PipedChannelWire>(
		publicEnv,
		`/channel/${encodeURIComponent(channelId)}`,
	)
)

export const pipedListTrending = async (
	publicEnv: SourcePublicEnvFor<Source.Piped_Rest>,
	limit: number,
	region = 'US',
) => (
	sliceStreamItems(
		await pipedApiGet<PipedStreamItemWire[]>(
			publicEnv,
			'/trending',
			{ region },
		),
		limit,
	)
)

export const pipedGetPlaylist = async (
	publicEnv: SourcePublicEnvFor<Source.Piped_Rest>,
	playlistId: string,
) => (
	pipedApiGet<PipedPlaylistWire>(
		publicEnv,
		`/playlists/${encodeURIComponent(playlistId)}`,
	)
)

export const pipedListPlaylistVideos = async (
	publicEnv: SourcePublicEnvFor<Source.Piped_Rest>,
	playlistId: string,
	limit: number,
	options?: {
		nextpage?: string
		playlist?: PipedPlaylistWire
	},
): Promise<PipedListPlaylistVideosWire> => (
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
		)(await pipedApiGet<PipedPlaylistNextpageWire>(
			publicEnv,
			`/nextpage/playlists/${encodeURIComponent(playlistId)}`,
			{ nextpage: options.nextpage },
		))
	: (
		(playlist) => ({
			items: sliceStreamItems(playlist.relatedStreams ?? [], limit),
			nextpage: playlist.nextpage,
		})
	)(await pipedGetPlaylist(publicEnv, playlistId))
)

export const pipedGetChannelTab = async (
	publicEnv: SourcePublicEnvFor<Source.Piped_Rest>,
	data: string,
	nextpage?: string,
) => (
	pipedApiGet<PipedChannelTabWire>(
		publicEnv,
		'/channels/tabs',
		{
			data,
			nextpage,
		},
	)
)

export const pipedGetComments = async (
	publicEnv: SourcePublicEnvFor<Source.Piped_Rest>,
	videoId: string,
) => (
	pipedApiGet<PipedCommentsWire>(
		publicEnv,
		`/comments/${encodeURIComponent(videoId)}`,
	)
)

export const pipedListComments = async (
	publicEnv: SourcePublicEnvFor<Source.Piped_Rest>,
	videoId: string,
	limit: number,
	options?: {
		nextpage?: string
	},
): Promise<PipedCommentsWire> => (
	options?.nextpage != null ?
		(
			(page) => ({
				comments: sliceComments(page.comments ?? [], limit),
				disabled: page.disabled,
				nextpage: page.nextpage,
			})
		)(await pipedApiGet<PipedCommentsWire>(
			publicEnv,
			`/nextpage/comments/${encodeURIComponent(videoId)}`,
			{ nextpage: options.nextpage },
		))
	: (
		(page) => ({
			comments: sliceComments(page.comments ?? [], limit),
			disabled: page.disabled,
			nextpage: page.nextpage,
		})
	)(await pipedGetComments(publicEnv, videoId))
)

export const pipedListChannelPlaylists = async (
	publicEnv: SourcePublicEnvFor<Source.Piped_Rest>,
	channelId: string,
	limit: number,
	options?: {
		nextpage?: string
		tabData?: string
		channel?: PipedChannelWire
	},
): Promise<PipedListChannelPlaylistsWire> => {
	const tabData = (
		options?.tabData
		?? pipedPlaylistsTabDataFromChannel(
			options?.channel
			?? await pipedGetChannel(publicEnv, channelId)
		)
	)
	if (tabData == null) {
		return { items: [] }
	}
	const page = await pipedGetChannelTab(publicEnv, tabData, options?.nextpage)
	return {
		items: slicePlaylistSummaries(
			pipedPlaylistSummariesFromTabContent(page.content),
			limit,
		),
		nextpage: page.nextpage,
	}
}

export const pipedListChannelVideos = async (
	publicEnv: SourcePublicEnvFor<Source.Piped_Rest>,
	channelId: string,
	limit: number,
	options?: {
		nextpage?: string
		stream?: PipedStreamWire
	},
): Promise<PipedListChannelVideosWire> => (
	options?.stream != null && options.nextpage == null ?
		{
			items: sliceStreamItems(
				(options.stream.relatedStreams ?? [])
					.filter((item) => (
						pipedChannelIdFromUploaderUrl(item.uploaderUrl) === channelId
					)),
				limit,
			),
		}
	: options?.nextpage != null ?
		(
			(page) => ({
				items: sliceStreamItems(page.relatedStreams ?? [], limit),
				nextpage: page.nextpage,
			})
		)(await pipedApiGet<PipedChannelNextpageWire>(
			publicEnv,
			`/nextpage/channel/${encodeURIComponent(channelId)}`,
			{ nextpage: options.nextpage },
		))
	: (
		(channel) => ({
			items: sliceStreamItems(channel.relatedStreams ?? [], limit),
			nextpage: channel.nextpage,
		})
	)(await pipedGetChannel(publicEnv, channelId))
)
