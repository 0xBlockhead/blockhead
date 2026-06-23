import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { YouTubeChannelSelector } from '$/schema/YouTubeChannel.ts'
import { YouTubeVideoSelector } from '$/schema/YouTubeVideo.ts'
import { YouTubePlaylistSelector } from '$/schema/YouTubePlaylist.ts'
import { YouTubeCommentSelector } from '$/schema/YouTubeComment.ts'
import { YouTubeChannel_TimestampSelector } from '$/schema/YouTubeChannel_Timestamp.ts'
import { YouTubeComment_TimestampSelector } from '$/schema/YouTubeComment_Timestamp.ts'
import { YouTubePlaylist_TimestampSelector } from '$/schema/YouTubePlaylist_Timestamp.ts'
export default {
	source: Source.Piped_Rest,

	resolvers: [
		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[YouTubeChannelSelector.ChannelId]: async ({ channelId }, context) => {
					const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
					const d = await getChannel(context.publicEnv, channelId)
					if (d.id == null) throw new Error('Piped_Rest: channel not found')
					const iconMedia = mediaFromUrl(optionalNonemptyString(d.avatarUrl), MediaType.Image)
					return {
						title: optionalNonemptyString(d.name),
						description: optionalNonemptyString(d.description),
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
			entityType: EntityType.YouTubePlaylist,
			resolve: {
				[YouTubePlaylistSelector.PlaylistId]: async ({ playlistId }, context) => {
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
			entityType: EntityType.YouTubeComment,
			resolve: {
				[YouTubeCommentSelector.VideoIdCommentId]: async ({ commentId, videoId }, context) => {
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
						text: optionalNonemptyString(comment.commentText),
						authorDisplayName: optionalNonemptyString(comment.author),
						...(authorChannelId != null && {
							authorChannelId,
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
				authorChannelId: (comment) => comment.authorChannelId,
				$author: (comment) => comment.$author,
				publishedAt: (comment) => comment.publishedAt,
				$video: (comment) => comment.$video,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeChannel_Timestamp,
			resolve: {
				[YouTubeChannel_TimestampSelector.YouTubeChannelTimestampMs]: async ({ $channel }, context) => {
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
			entityType: EntityType.YouTubeComment_Timestamp,
			resolve: {
				[YouTubeComment_TimestampSelector.YouTubeCommentTimestampMs]: async ({ $comment }, context) => {
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
			entityType: EntityType.YouTubePlaylist_Timestamp,
			resolve: {
				[YouTubePlaylist_TimestampSelector.YouTubePlaylistTimestampMs]: async ({ $playlist }, context) => {
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
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[YouTubeChannelSelector.ChannelId]: async (entitySelector, context) => {
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
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[YouTubeChannelSelector.ChannelId]: async ({ channelId }, context) => {
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
			entityType: EntityType.YouTubePlaylist,
			resolve: {
				[YouTubePlaylistSelector.PlaylistId]: async (entitySelector, context) => {
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
			entityType: EntityType.YouTubePlaylist,
			resolve: {
				[YouTubePlaylistSelector.PlaylistId]: async ({ playlistId }, context) => {
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
			entityType: EntityType.YouTubeVideo,
			resolve: {
				[YouTubeVideoSelector.VideoId]: async ({ videoId }, context) => {
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
			entityType: EntityType.YouTubeComment,
			resolve: {
				[YouTubeCommentSelector.VideoIdCommentId]: async (entitySelector, context) => {
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

	],
}
