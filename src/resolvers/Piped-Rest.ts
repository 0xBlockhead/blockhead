import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { YoutubeChannelSelector } from '$/schema/YoutubeChannel.ts'
import { YoutubeVideoSelector } from '$/schema/YoutubeVideo.ts'
import { YoutubePlaylistSelector } from '$/schema/YoutubePlaylist.ts'
import { YoutubeCommentSelector } from '$/schema/YoutubeComment.ts'
import { YoutubeChannel_TimestampSelector } from '$/schema/YoutubeChannel_Timestamp.ts'
import { YoutubeComment_TimestampSelector } from '$/schema/YoutubeComment_Timestamp.ts'
import { YoutubePlaylist_TimestampSelector } from '$/schema/YoutubePlaylist_Timestamp.ts'
import { _GlobalYoutubeNetworkSelector } from '$/schema/_GlobalYoutubeNetwork.ts'

const pipedPlainText = (
	value: string | undefined
) => optionalNonemptyString(
	value
		?.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<a\b[^>]*>(.*?)<\/a>/gis, '$1')
		.replace(/<[^>]+>/g, '')
		.replaceAll('&nbsp;', ' ')
		.replaceAll('&amp;', '&')
		.replaceAll('&quot;', '"')
		.replaceAll('&#39;', '\'')
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replace(/\n{3,}/g, '\n\n')
		.trim()
)

export default {
	source: Source.Piped_Rest,

	resolvers: [
		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubeChannel,
			resolve: {
				[YoutubeChannelSelector.ChannelId]: async ({ channelId }, context) => {
					const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
					const d = await getChannel(context.publicEnv, channelId)
					if (d.id == null) throw new Error('Piped_Rest: channel not found')
					const iconMedia = mediaFromUrl(optionalNonemptyString(d.avatarUrl), MediaType.Image)
					return {
						title: optionalNonemptyString(d.name),
						description: pipedPlainText(d.description),
						...(iconMedia != null && {
							$icon: iconMedia,
						}),
					}
				}
			},
		})({
			fields: {
				title: (channel) => channel.title,
				description: (channel) => channel.description,
				$icon: (channel) => channel.$icon,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubePlaylist,
			resolve: {
				[YoutubePlaylistSelector.PlaylistId]: async ({ playlistId }, context) => {
					const { getChannelIdFromUploaderUrl, getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
					const d = await getPlaylist(context.publicEnv, playlistId)
					if (optionalNonemptyString(d.name) == null) throw new Error('Piped_Rest: playlist not found')
					const channelId = getChannelIdFromUploaderUrl(d.uploaderUrl)
					return {
						title: optionalNonemptyString(d.name),
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
				$channel: (playlist) => playlist.$channel,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubeVideo,
			resolve: {
				[YoutubeVideoSelector.VideoId]: async ({ videoId }, context) => {
					const { getChannelIdFromUploaderUrl, getStream } = await import('$/sources/Piped/Rest/queries.ts')
					const d = await getStream(context.publicEnv, videoId)
					const title = optionalNonemptyString(d.title)
					if (title == null) throw new Error('Piped_Rest: video not found')
					const channelId = getChannelIdFromUploaderUrl(d.uploaderUrl)
					const publishedAt = optionalNonemptyString(d.uploadDate)
					const publishedAtMs = optionalTimestampMs(d.uploadDate)
					const thumbnailUrl = optionalNonemptyString(d.thumbnailUrl)
					return {
						title,
						description: pipedPlainText(d.description),
						...(publishedAt != null && { publishedAt }),
						...(publishedAtMs != null && { publishedAtMs }),
						...(d.duration != null && { durationSeconds: d.duration }),
						...(thumbnailUrl != null && {
							thumbnailUrl,
						}),
						$author: (
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
				title: (video) => video.title,
				description: (video) => video.description,
				publishedAt: (video) => video.publishedAt,
				publishedAtMs: (video) => video.publishedAtMs,
				durationSeconds: (video) => video.durationSeconds,
				thumbnailUrl: (video) => video.thumbnailUrl,
				$author: (video) => video.$author,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubeComment,
			resolve: {
				[YoutubeCommentSelector.VideoIdCommentId]: async ({ commentId, videoId }, context) => {
					const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					const page = await listComments(publicEnv, videoId, limit)
					if (page.disabled === true)
						throw new Error(`Piped_Rest: comments disabled for video ${videoId}`)
					const comment = (page.comments ?? []).find((comment) => (
						comment.commentId === commentId
					))
					if (comment == null) throw new Error('Piped_Rest: comment not found')
					const publishedAt = optionalNonemptyString(comment.commentedTime)
					const authorChannelId = comment.commentorUrl?.match(/\/channel\/([^/?]+)/)?.[1]
					return {
						text: pipedPlainText(comment.commentText),
						authorDisplayName: optionalNonemptyString(comment.author),
						...(authorChannelId != null && {
							$author: {
								[EntityMetaKey.Selector]: { channelId: authorChannelId },
							},
						}),
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
				$author: (comment) => comment.$author,
				publishedAt: (comment) => comment.publishedAt,
				$video: (comment) => comment.$video,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubeChannel_Timestamp,
			resolve: {
				[YoutubeChannel_TimestampSelector.YoutubeChannelTimestampMs]: async ({ $channel }, context) => {
					const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
					const channel = await getChannel(context.publicEnv, $channel.channelId)
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
			entityType: EntityType.YoutubeComment_Timestamp,
			resolve: {
				[YoutubeComment_TimestampSelector.YoutubeCommentTimestampMs]: async ({ $comment }, context) => {
					const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					const page = await listComments(publicEnv, $comment.videoId, limit)
					if (page.disabled === true)
						throw new Error(`Piped_Rest: comments disabled for video ${$comment.videoId}`)
					const comment = (page.comments ?? []).find((comment) => (
						comment.commentId === $comment.commentId
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
			entityType: EntityType.YoutubePlaylist_Timestamp,
			resolve: {
				[YoutubePlaylist_TimestampSelector.YoutubePlaylistTimestampMs]: async ({ $playlist }, context) => {
					const { getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
					const playlist = await getPlaylist(context.publicEnv, $playlist.playlistId)
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
			entityType: EntityType.YoutubeChannel,
			resolve: {
				[YoutubeChannelSelector.ChannelId]: async (entitySelector, context) => {
					const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
					const channel = await getChannel(context.publicEnv, entitySelector.channelId)
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
			entityType: EntityType.YoutubeChannel,
			resolve: {
				[YoutubeChannelSelector.ChannelId]: async ({ channelId }, context) => {
					const { listChannelVideos, getVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						(await listChannelVideos(publicEnv, channelId, limit)).items
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
			entityType: EntityType.YoutubeChannel,
			resolve: {
				[YoutubeChannelSelector.ChannelId]: async ({ channelId }, context) => {
					const {
						listChannelPlaylists,
						getPlaylistIdFromUrl,
					} = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						(await listChannelPlaylists(publicEnv, channelId, limit)).items
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
			entityType: EntityType.YoutubePlaylist,
			resolve: {
				[YoutubePlaylistSelector.PlaylistId]: async (entitySelector, context) => {
					const { getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
					const playlist = await getPlaylist(context.publicEnv, entitySelector.playlistId)
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
			entityType: EntityType.YoutubePlaylist,
			resolve: {
				[YoutubePlaylistSelector.PlaylistId]: async ({ playlistId }, context) => {
					const { listPlaylistVideos, getVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						(await listPlaylistVideos(publicEnv, playlistId, limit)).items
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
			entityType: EntityType.YoutubeVideo,
			resolve: {
				[YoutubeVideoSelector.VideoId]: async ({ videoId }, context) => {
					const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					const page = await listComments(publicEnv, videoId, limit)
					if (page.disabled === true)
						throw new Error(`Piped_Rest: comments disabled for video ${videoId}`)
					return (
						(page.comments ?? [])
							.flatMap((comment) => {
							const commentId = optionalNonemptyString(comment.commentId)
							return commentId == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: {
										videoId,
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
			entityType: EntityType.YoutubeComment,
			resolve: {
				[YoutubeCommentSelector.VideoIdCommentId]: async (entitySelector, context) => {
					const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					const page = await listComments(publicEnv, entitySelector.videoId, limit)
					if (page.disabled === true)
						throw new Error(`Piped_Rest: comments disabled for video ${entitySelector.videoId}`)
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
			entityType: EntityType._GlobalYoutubeNetwork,
			resolve: {
				[_GlobalYoutubeNetworkSelector.Scope]: async (_entitySelector, context) => {
					const { getChannelIdFromUploaderUrl, listTrending } = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						(await listTrending(publicEnv, limit))
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
				$$sourceWindowChannels: (network) => network,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType._GlobalYoutubeNetwork,
			resolve: {
				[_GlobalYoutubeNetworkSelector.Scope]: async (_entitySelector, context) => {
					const { listTrending, getVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						((await listTrending(publicEnv, limit)))
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
				$$sourceWindowVideos: (network) => network,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType._GlobalYoutubeNetwork,
			resolve: {
				[_GlobalYoutubeNetworkSelector.Scope]: async () => (
					[]
				)
			},
		})({
			fields: {
				$$sourceWindowPlaylists: (network) => network,
			},
		}),

	],
}
