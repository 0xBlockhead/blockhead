import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { type } from 'arktype'
import { singleFlight } from '$/lib/singleFlight.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { UrlString } from '$/schema/$Url.ts'
import { YouTubeLiveBroadcastContent } from '$/schema/YouTubeVideo.ts'
import { Source } from '$/sources/$Source.ts'
export default {
	source: Source.Piped_Rest,

	resolvers: [
		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
				const d = await singleFlight(getChannel)(context.publicEnv, entityId.channelId)
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
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const {
					getChannelIdFromUploaderUrl,
					getStream,
				} = await import('$/sources/Piped/Rest/queries.ts')
				const d = await singleFlight(getStream)(context.publicEnv, entityId.videoId)
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
								[EntityMetaKey.Id]: { channelId },
							}
					),
					...(thumbnailUrl != null && { thumbnailUrl }),
				}
			}
			},
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
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getChannelIdFromUploaderUrl, getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
				const d = await singleFlight(getPlaylist)(context.publicEnv, entityId.playlistId)
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
								[EntityMetaKey.Id]: { channelId },
							}
					),
				}
			}
			},
			fields: {
				title: (playlist) => playlist.title,
				itemCount: (playlist) => playlist.itemCount,
				$channel: (playlist) => playlist.$channel,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeComment,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				const page = await singleFlight(listComments)(publicEnv, entityId.videoId, limit)
				if (page.disabled === true) {
					throw new Error(`Piped_Rest: comments disabled for video ${entityId.videoId}`)
				}
				const comment = (page.comments ?? []).find((comment) => (
					comment.commentId === entityId.commentId
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
							[EntityMetaKey.Id]: { channelId: authorChannelId },
						},
					}),
					...(comment.likeCount != null && { likeCount: comment.likeCount }),
					...(publishedAt != null && { publishedAt }),
					$video: {
						[EntityMetaKey.Id]: { videoId: entityId.videoId },
					},
				}
			}
			},
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
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
				const channel = await singleFlight(getChannel)(context.publicEnv, entityId.$channel.channelId)
				if (channel.id == null) throw new Error('Piped_Rest: channel not found')
				return {
					...(channel.subscriberCount != null && { subscriberCount: channel.subscriberCount }),
				}
			}
			},
			fields: {
				subscriberCount: (timestamp) => timestamp.subscriberCount,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeVideo_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getStream } = await import('$/sources/Piped/Rest/queries.ts')
				const stream = await singleFlight(getStream)(context.publicEnv, entityId.$video.videoId)
				if (optionalNonemptyString(stream.title) == null) throw new Error('Piped_Rest: video not found')
				return {
					...(stream.views != null && { viewCount: stream.views }),
					...(stream.likes != null && { likeCount: stream.likes }),
				}
			}
			},
			fields: {
				viewCount: (timestamp) => timestamp.viewCount,
				likeCount: (timestamp) => timestamp.likeCount,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeComment_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				const page = await singleFlight(listComments)(publicEnv, entityId.$comment.videoId, limit)
				if (page.disabled === true) {
					throw new Error(`Piped_Rest: comments disabled for video ${entityId.$comment.videoId}`)
				}
				const comment = (page.comments ?? []).find((comment) => (
					comment.commentId === entityId.$comment.commentId
				))
				if (comment == null) throw new Error('Piped_Rest: comment not found')
				return {
					...(comment.likeCount != null && { likeCount: comment.likeCount }),
				}
			}
			},
			fields: {
				likeCount: (timestamp) => timestamp.likeCount,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubePlaylist_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
				const playlist = await singleFlight(getPlaylist)(context.publicEnv, entityId.$playlist.playlistId)
				if (optionalNonemptyString(playlist.name) == null) throw new Error('Piped_Rest: playlist not found')
				return {
					...(playlist.videos != null && { itemCount: playlist.videos }),
				}
			}
			},
			fields: {
				itemCount: (timestamp) => timestamp.itemCount,
			},
		}),
		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
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
									[EntityMetaKey.Id]: { channelId },
								}]
						})
				)
			}
			},
			fields: {
				$$youtubeChannels: (network) => network,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
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
										[EntityMetaKey.Id]: { videoId },
									}]
							))(getVideoIdFromUrl(video.url))
						))
				)
			}
			},
			fields: {
				$$youtubeVideos: (network) => network,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async () => (
				[]
			)
			},
			fields: {
				$$youtubePlaylists: (network) => network,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
				const channel = await singleFlight(getChannel)(context.publicEnv, entityId.channelId)
				if (channel.id == null) throw new Error('Piped_Rest: channel not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$channel: entityId,
							timestampMs: Date.now(),
						},
						...(channel.subscriberCount != null && { subscriberCount: channel.subscriberCount }),
					},
				]
			}
			},
			fields: {
				$$timestamps: (channel) => channel,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listChannelVideos, getVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						(await singleFlight(listChannelVideos)(publicEnv, entityId.channelId, limit)).items
							.flatMap((video) => (
								((videoId) => (
								videoId == null ?
									[]
								:
									[{
										[EntityMetaKey.Id]: { videoId },
									}]
							))(getVideoIdFromUrl(video.url))
						))
				)
			}
			},
			fields: {
				$$videos: (channel) => channel,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const {
					listChannelPlaylists,
					getPlaylistIdFromUrl,
				} = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						(await singleFlight(listChannelPlaylists)(publicEnv, entityId.channelId, limit)).items
							.flatMap((video) => (
								((playlistId) => (
								playlistId == null ?
									[]
								:
									[{
										[EntityMetaKey.Id]: { playlistId },
									}]
							))(getPlaylistIdFromUrl(video.url))
						))
				)
			}
			},
			fields: {
				$$playlists: (channel) => channel,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubePlaylist,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
				const playlist = await singleFlight(getPlaylist)(context.publicEnv, entityId.playlistId)
				if (optionalNonemptyString(playlist.name) == null) throw new Error('Piped_Rest: playlist not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$playlist: entityId,
							timestampMs: Date.now(),
						},
						...(playlist.videos != null && { itemCount: playlist.videos }),
					},
				]
			}
			},
			fields: {
				$$timestamps: (playlist) => playlist,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubePlaylist,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listPlaylistVideos, getVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						(await singleFlight(listPlaylistVideos)(publicEnv, entityId.playlistId, limit)).items
							.flatMap((video) => (
								((videoId) => (
								videoId == null ?
									[]
								:
									[{
										[EntityMetaKey.Id]: { videoId },
									}]
							))(getVideoIdFromUrl(video.url))
						))
				)
			}
			},
			fields: {
				$$videos: (playlist) => playlist,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeVideo,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getStream } = await import('$/sources/Piped/Rest/queries.ts')
				const stream = await singleFlight(getStream)(context.publicEnv, entityId.videoId)
				if (optionalNonemptyString(stream.title) == null) throw new Error('Piped_Rest: video not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$video: entityId,
							timestampMs: Date.now(),
						},
						...(stream.views != null && { viewCount: stream.views }),
						...(stream.likes != null && { likeCount: stream.likes }),
					},
				]
			}
			},
			fields: {
				$$timestamps: (video) => video,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeVideo,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				const page = await singleFlight(listComments)(publicEnv, entityId.videoId, limit)
				if (page.disabled === true) {
					throw new Error(`Piped_Rest: comments disabled for video ${entityId.videoId}`)
				}
				return (
					(page.comments ?? [])
						.flatMap((comment) => {
							const commentId = optionalNonemptyString(comment.commentId)
							return commentId == null ?
								[]
							:
								[{
									[EntityMetaKey.Id]: {
										videoId: entityId.videoId,
										commentId,
									},
								}]
						})
				)
			}
			},
			fields: {
				$$comments: (video) => video,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeComment,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				const page = await singleFlight(listComments)(publicEnv, entityId.videoId, limit)
				if (page.disabled === true) {
					throw new Error(`Piped_Rest: comments disabled for video ${entityId.videoId}`)
				}
				const comment = (page.comments ?? []).find((comment) => (
					comment.commentId === entityId.commentId
				))
				if (comment == null) throw new Error('Piped_Rest: comment not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$comment: entityId,
							timestampMs: Date.now(),
						},
						...(comment.likeCount != null && { likeCount: comment.likeCount }),
					},
				]
			}
			},
			fields: {
				$$timestamps: (comment) => comment,
			},
		}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YouTubeComment,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, _context) => {
				throw new Error(`Piped_Rest: $$replies unsupported for comment ${entityId.commentId}`)
			}
			},
			fields: {
				$$replies: (comment) => comment,
			},
		}),
	],
}
