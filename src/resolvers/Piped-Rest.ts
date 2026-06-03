import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { type } from 'arktype'
import { singleFlight } from '$/lib/singleFlight.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { UrlString } from '$/schema/$Url.ts'
import { YouTubeLiveBroadcastContent } from '$/schema/YouTubeVideo.ts'
import { Source } from '$/sources/$Source.ts'
export default {
	source: Source.Piped_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.YouTubeChannel,
			resolve: async (entityId, context) => {
				const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
				const d = await singleFlight(getChannel)(sourcePublicEnv(context, Source.Piped_Rest), entityId.channelId)
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubeVideo,
			resolve: async (entityId, context) => {
				const {
					getChannelIdFromUploaderUrl,
					getStream,
				} = await import('$/sources/Piped/Rest/queries.ts')
				const d = await singleFlight(getStream)(sourcePublicEnv(context, Source.Piped_Rest), entityId.videoId)
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubePlaylist,
			resolve: async (entityId, context) => {
				const { getChannelIdFromUploaderUrl, getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
				const d = await singleFlight(getPlaylist)(sourcePublicEnv(context, Source.Piped_Rest), entityId.playlistId)
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubeComment,
			resolve: async (entityId, context) => {
				const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubeChannel_Timestamp,
			resolve: async (entityId, context) => {
				const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
				const channel = await singleFlight(getChannel)(sourcePublicEnv(context, Source.Piped_Rest), entityId.$channel.channelId)
				if (channel.id == null) throw new Error('Piped_Rest: channel not found')
				return {
					...(channel.subscriberCount != null && { subscriberCount: channel.subscriberCount }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubeVideo_Timestamp,
			resolve: async (entityId, context) => {
				const { getStream } = await import('$/sources/Piped/Rest/queries.ts')
				const stream = await singleFlight(getStream)(sourcePublicEnv(context, Source.Piped_Rest), entityId.$video.videoId)
				if (optionalNonemptyString(stream.title) == null) throw new Error('Piped_Rest: video not found')
				return {
					...(stream.views != null && { viewCount: stream.views }),
					...(stream.likes != null && { likeCount: stream.likes }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubeComment_Timestamp,
			resolve: async (entityId, context) => {
				const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubePlaylist_Timestamp,
			resolve: async (entityId, context) => {
				const { getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
				const playlist = await singleFlight(getPlaylist)(sourcePublicEnv(context, Source.Piped_Rest), entityId.$playlist.playlistId)
				if (optionalNonemptyString(playlist.name) == null) throw new Error('Piped_Rest: playlist not found')
				return {
					...(playlist.videos != null && { itemCount: playlist.videos }),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.YouTubeNetwork,
			fieldName: '$$youtubeChannels',
			resolve: async (_entityId, context) => {
				const { getChannelIdFromUploaderUrl, listTrending } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeNetwork,
			fieldName: '$$youtubeVideos',
			resolve: async (_entityId, context) => {
				const { listTrending, getVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeNetwork,
			fieldName: '$$youtubePlaylists',
			resolve: async () => (
				[]
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeChannel,
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
				const channel = await singleFlight(getChannel)(sourcePublicEnv(context, Source.Piped_Rest), entityId.channelId)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeChannel,
			fieldName: '$$videos',
			resolve: async (entityId, context) => {
				const { listChannelVideos, getVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
					const limit = resolverLoadSubsetRowLimit(context)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeChannel,
			fieldName: '$$playlists',
			resolve: async (entityId, context) => {
				const {
					listChannelPlaylists,
					getPlaylistIdFromUrl,
				} = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
					const limit = resolverLoadSubsetRowLimit(context)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubePlaylist,
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const { getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
				const playlist = await singleFlight(getPlaylist)(sourcePublicEnv(context, Source.Piped_Rest), entityId.playlistId)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubePlaylist,
			fieldName: '$$videos',
			resolve: async (entityId, context) => {
				const { listPlaylistVideos, getVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
					const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
					const limit = resolverLoadSubsetRowLimit(context)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeVideo,
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const { getStream } = await import('$/sources/Piped/Rest/queries.ts')
				const stream = await singleFlight(getStream)(sourcePublicEnv(context, Source.Piped_Rest), entityId.videoId)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeVideo,
			fieldName: '$$comments',
			resolve: async (entityId, context) => {
				const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeComment,
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeComment,
			fieldName: '$$replies',
			resolve: async (entityId, _context) => {
				throw new Error(`Piped_Rest: $$replies unsupported for comment ${entityId.commentId}`)
			},
		}),
	],
}
