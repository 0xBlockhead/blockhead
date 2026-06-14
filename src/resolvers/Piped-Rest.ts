import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { type } from 'arktype'
import { singleFlight } from '$/lib/singleFlight.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { YouTubeLiveBroadcastContent } from '$/schema/YouTubeVideo.ts'
import { Source } from '$/sources/Source.ts'
import { YouTubeChannelSelector } from '$/schema/YouTubeChannel.ts'
import { YouTubeVideoSelector } from '$/schema/YouTubeVideo.ts'
import { YouTubePlaylistSelector } from '$/schema/YouTubePlaylist.ts'
import { YouTubeCommentSelector } from '$/schema/YouTubeComment.ts'
import { YouTubeChannel_TimestampSelector } from '$/schema/YouTubeChannel_Timestamp.ts'
import { YouTubeVideo_TimestampSelector } from '$/schema/YouTubeVideo_Timestamp.ts'
import { YouTubeComment_TimestampSelector } from '$/schema/YouTubeComment_Timestamp.ts'
import { YouTubePlaylist_TimestampSelector } from '$/schema/YouTubePlaylist_Timestamp.ts'
import { YouTubeNetworkSelector } from '$/schema/YouTubeNetwork.ts'
export default {
	source: Source.Piped_Rest,

	resolvers: [
		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[YouTubeChannelSelector.ChannelId]: async ({ channelId }, context) => {
				const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
				const d = await singleFlight(getChannel)(context.publicEnv, channelId)
				if (d.id == null) throw new Error('Piped_Rest: channel not found')
				return {
					title: optionalNonemptyString(d.name),
					description: optionalNonemptyString(d.description),
					...(d.subscriberCount != null && { subscriberCount: d.subscriberCount }),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(optionalNonemptyString(d.avatarUrl), MediaType.Image)),
				}
			}
			},
		})({
				fields: {
				title: (channel) => channel.title,
				description: (channel) => channel.description,
				subscriberCount: (channel) => channel.subscriberCount,
				$icon: (channel) => channel.$icon,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeVideo,
			resolve: {
				[YouTubeVideoSelector.VideoId]: async ({ videoId }, context) => {
				const {
					getChannelIdFromUploaderUrl,
					getStream,
				} = await import('$/sources/Piped/Rest/queries.ts')
				const d = await singleFlight(getStream)(context.publicEnv, videoId)
				if (optionalNonemptyString(d.title) == null) throw new Error('Piped_Rest: video not found')
				const channelId = getChannelIdFromUploaderUrl(d.uploaderUrl)
				const thumbnailUrl = (
					((urlString) => (
						urlString == null ?
							undefined
						:
							(
								(parsed) => (
									parsed instanceof type.errors ?
										undefined
									:
										parsed
								)
							)(UrlString(urlString))
					))(optionalNonemptyString(d.thumbnailUrl))
				)
				const publishedAt = optionalNonemptyString(d.uploadDate)
				return {
					title: optionalNonemptyString(d.title),
					description: optionalNonemptyString(d.description),
					...(publishedAt != null && { publishedAt }),
					...(d.views != null && { viewCount: d.views }),
					...(d.likes != null && { likeCount: d.likes }),
					...(d.duration != null && { durationSeconds: d.duration }),
					...(d.livestream === true && {
						liveBroadcastContent: YouTubeLiveBroadcastContent.Live,
					}),
					...(d.livestream === false && {
						liveBroadcastContent: YouTubeLiveBroadcastContent.None,
					}),
					$author: (
						channelId == null ?
							undefined
						:
							{
								[EntityMetaKey.Selector]: { channelId },
							}
					),
					...(thumbnailUrl != null && { thumbnailUrl }),
				}
			}
			},
		})({
				fields: {
				title: (video) => video.title,
				description: (video) => video.description,
				publishedAt: (video) => video.publishedAt,
				viewCount: (video) => video.viewCount,
				likeCount: (video) => video.likeCount,
				durationSeconds: (video) => video.durationSeconds,
				liveBroadcastContent: (video) => video.liveBroadcastContent,
				$author: (video) => video.$author,
				thumbnailUrl: (video) => video.thumbnailUrl,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubePlaylist,
			resolve: {
				[YouTubePlaylistSelector.PlaylistId]: async ({ playlistId }, context) => {
				const { getChannelIdFromUploaderUrl, getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
				const d = await singleFlight(getPlaylist)(context.publicEnv, playlistId)
				if (optionalNonemptyString(d.name) == null) throw new Error('Piped_Rest: playlist not found')
				const channelId = getChannelIdFromUploaderUrl(d.uploaderUrl)
				return {
					title: optionalNonemptyString(d.name),
					...(d.videos != null && { itemCount: d.videos }),
					$channel: (
						channelId == null ?
							undefined
						:
							{
								[EntityMetaKey.Selector]: { channelId },
							}
					),
				}
			}
			},
		})({
				fields: {
				title: (playlist) => playlist.title,
				itemCount: (playlist) => playlist.itemCount,
				$channel: (playlist) => playlist.$channel,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeComment,
			resolve: {
				[YouTubeCommentSelector.VideoIdCommentId]: async ({ videoId }, context) => {
				const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				const page = await singleFlight(listComments)(publicEnv, videoId, limit)
				if (page.disabled === true) {
					throw new Error(`Piped_Rest: comments disabled for video ${videoId}`)
				}
				const comment = (page.comments ?? []).find((comment) => (
					comment.commentId === entitySelector.commentId
				))
				if (comment == null) throw new Error('Piped_Rest: comment not found')
				const publishedAt = optionalNonemptyString(comment.commentedTime)
				const authorChannelId = comment.commentorUrl?.match(/\/channel\/([^/?]+)/)?.[1]
				return {
					text: optionalNonemptyString(comment.commentText),
					authorDisplayName: optionalNonemptyString(comment.author),
					...(authorChannelId != null && {
						authorChannelId,
						$author: {
							[EntityMetaKey.Selector]: { channelId: authorChannelId },
						},
					}),
					...(comment.likeCount != null && { likeCount: comment.likeCount }),
					...(publishedAt != null && { publishedAt }),
					$video: {
						[EntityMetaKey.Selector]: { videoId: videoId },
					},
				}
			}
			},
		})({
				fields: {
				text: (comment) => comment.text,
				authorDisplayName: (comment) => comment.authorDisplayName,
				authorChannelId: (comment) => comment.authorChannelId,
				$author: (comment) => comment.$author,
				likeCount: (comment) => comment.likeCount,
				publishedAt: (comment) => comment.publishedAt,
				$video: (comment) => comment.$video,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeChannel_Timestamp,
			resolve: {
				[YouTubeChannel_TimestampSelector.YouTubeChannelTimestampMs]: async ({ $channel }, context) => {
				const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
				const channel = await singleFlight(getChannel)(context.publicEnv, $channel.channelId)
				if (channel.id == null) throw new Error('Piped_Rest: channel not found')
				return {
					...(channel.subscriberCount != null && { subscriberCount: channel.subscriberCount }),
				}
			}
			},
		})({
				fields: {
				subscriberCount: (timestamp) => timestamp.subscriberCount,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeVideo_Timestamp,
			resolve: {
				[YouTubeVideo_TimestampSelector.YouTubeVideoTimestampMs]: async ({ $video }, context) => {
				const { getStream } = await import('$/sources/Piped/Rest/queries.ts')
				const stream = await singleFlight(getStream)(context.publicEnv, $video.videoId)
				if (optionalNonemptyString(stream.title) == null) throw new Error('Piped_Rest: video not found')
				return {
					...(stream.views != null && { viewCount: stream.views }),
					...(stream.likes != null && { likeCount: stream.likes }),
				}
			}
			},
		})({
				fields: {
				viewCount: (timestamp) => timestamp.viewCount,
				likeCount: (timestamp) => timestamp.likeCount,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeComment_Timestamp,
			resolve: {
				[YouTubeComment_TimestampSelector.YouTubeCommentTimestampMs]: async ({ $comment }, context) => {
				const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				const page = await singleFlight(listComments)(publicEnv, $comment.videoId, limit)
				if (page.disabled === true) {
					throw new Error(`Piped_Rest: comments disabled for video ${$comment.videoId}`)
				}
				const comment = (page.comments ?? []).find((comment) => (
					comment.commentId === entitySelector.$comment.commentId
				))
				if (comment == null) throw new Error('Piped_Rest: comment not found')
				return {
					...(comment.likeCount != null && { likeCount: comment.likeCount }),
				}
			}
			},
		})({
				fields: {
				likeCount: (timestamp) => timestamp.likeCount,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubePlaylist_Timestamp,
			resolve: {
				[YouTubePlaylist_TimestampSelector.YouTubePlaylistTimestampMs]: async ({ $playlist }, context) => {
				const { getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
				const playlist = await singleFlight(getPlaylist)(context.publicEnv, $playlist.playlistId)
				if (optionalNonemptyString(playlist.name) == null) throw new Error('Piped_Rest: playlist not found')
				return {
					...(playlist.videos != null && { itemCount: playlist.videos }),
				}
			}
			},
		})({
				fields: {
				itemCount: (timestamp) => timestamp.itemCount,
			},
			}),
		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeNetwork,
			resolve: {
				[YouTubeNetworkSelector.Scope]: async (_entitySelector, context) => {
				const { getChannelIdFromUploaderUrl, listTrending } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				return (
					(await singleFlight(listTrending)(publicEnv, limit))
						.flatMap((video) => {
							const channelId = getChannelIdFromUploaderUrl(video.uploaderUrl)
							return channelId == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: { channelId },
								}]
						})
				)
			}
			},
		})({
				fields: {
				$$youtubeChannels: (network) => network,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeNetwork,
			resolve: {
				[YouTubeNetworkSelector.Scope]: async (_entitySelector, context) => {
				const { listTrending, getVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listTrending)(publicEnv, limit)))
						.flatMap((video) => (
							((videoId) => (
								videoId == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: { videoId },
									}]
							))(getVideoIdFromUrl(video.url))
						))
				)
			}
			},
		})({
				fields: {
				$$youtubeVideos: (network) => network,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeNetwork,
			resolve: {
				[YouTubeNetworkSelector.Scope]: async () => (
				[]
			)
			},
		})({
				fields: {
				$$youtubePlaylists: (network) => network,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[YouTubeChannelSelector.ChannelId]: async (entitySelector, context) => {
				const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
				const channel = await singleFlight(getChannel)(context.publicEnv, entitySelector.channelId)
				if (channel.id == null) throw new Error('Piped_Rest: channel not found')
				return [
					{
						[EntityMetaKey.Selector]: {
							$channel: entitySelector,
							timestampMs: Date.now(),
						},
						...(channel.subscriberCount != null && { subscriberCount: channel.subscriberCount }),
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (channel) => channel,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[YouTubeChannelSelector.ChannelId]: async ({ channelId }, context) => {
				const { listChannelVideos, getVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						(await singleFlight(listChannelVideos)(publicEnv, channelId, limit)).items
							.flatMap((video) => (
								((videoId) => (
								videoId == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: { videoId },
									}]
							))(getVideoIdFromUrl(video.url))
						))
				)
			}
			},
		})({
				fields: {
				$$videos: (channel) => channel,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[YouTubeChannelSelector.ChannelId]: async ({ channelId }, context) => {
				const {
					listChannelPlaylists,
					getPlaylistIdFromUrl,
				} = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						(await singleFlight(listChannelPlaylists)(publicEnv, channelId, limit)).items
							.flatMap((video) => (
								((playlistId) => (
								playlistId == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: { playlistId },
									}]
							))(getPlaylistIdFromUrl(video.url))
						))
				)
			}
			},
		})({
				fields: {
				$$playlists: (channel) => channel,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubePlaylist,
			resolve: {
				[YouTubePlaylistSelector.PlaylistId]: async (entitySelector, context) => {
				const { getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
				const playlist = await singleFlight(getPlaylist)(context.publicEnv, entitySelector.playlistId)
				if (optionalNonemptyString(playlist.name) == null) throw new Error('Piped_Rest: playlist not found')
				return [
					{
						[EntityMetaKey.Selector]: {
							$playlist: entitySelector,
							timestampMs: Date.now(),
						},
						...(playlist.videos != null && { itemCount: playlist.videos }),
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (playlist) => playlist,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubePlaylist,
			resolve: {
				[YouTubePlaylistSelector.PlaylistId]: async ({ playlistId }, context) => {
				const { listPlaylistVideos, getVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						(await singleFlight(listPlaylistVideos)(publicEnv, playlistId, limit)).items
							.flatMap((video) => (
								((videoId) => (
								videoId == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: { videoId },
									}]
							))(getVideoIdFromUrl(video.url))
						))
				)
			}
			},
		})({
				fields: {
				$$videos: (playlist) => playlist,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeVideo,
			resolve: {
				[YouTubeVideoSelector.VideoId]: async (entitySelector, context) => {
				const { getStream } = await import('$/sources/Piped/Rest/queries.ts')
				const stream = await singleFlight(getStream)(context.publicEnv, entitySelector.videoId)
				if (optionalNonemptyString(stream.title) == null) throw new Error('Piped_Rest: video not found')
				return [
					{
						[EntityMetaKey.Selector]: {
							$video: entitySelector,
							timestampMs: Date.now(),
						},
						...(stream.views != null && { viewCount: stream.views }),
						...(stream.likes != null && { likeCount: stream.likes }),
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (video) => video,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeVideo,
			resolve: {
				[YouTubeVideoSelector.VideoId]: async ({ videoId }, context) => {
				const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				const page = await singleFlight(listComments)(publicEnv, videoId, limit)
				if (page.disabled === true) {
					throw new Error(`Piped_Rest: comments disabled for video ${videoId}`)
				}
				return (
					(page.comments ?? [])
						.flatMap((comment) => {
							const commentId = optionalNonemptyString(comment.commentId)
							return commentId == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: {
										videoId: entitySelector.videoId,
										commentId,
									},
								}]
						})
				)
			}
			},
		})({
				fields: {
				$$comments: (video) => video,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeComment,
			resolve: {
				[YouTubeCommentSelector.VideoIdCommentId]: async (entitySelector, context) => {
				const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				const page = await singleFlight(listComments)(publicEnv, entitySelector.videoId, limit)
				if (page.disabled === true) {
					throw new Error(`Piped_Rest: comments disabled for video ${entitySelector.videoId}`)
				}
				const comment = (page.comments ?? []).find((comment) => (
					comment.commentId === entitySelector.commentId
				))
				if (comment == null) throw new Error('Piped_Rest: comment not found')
				return [
					{
						[EntityMetaKey.Selector]: {
							$comment: entitySelector,
							timestampMs: Date.now(),
						},
						...(comment.likeCount != null && { likeCount: comment.likeCount }),
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (comment) => comment,
			},
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeComment,
			resolve: {
				[YouTubeCommentSelector.VideoIdCommentId]: async ({ commentId }, _context) => {
				throw new Error(`Piped_Rest: $$replies unsupported for comment ${commentId}`)
			}
			},
		})({
				fields: {
				$$replies: (comment) => comment,
			},
			}),
	],
}
