import { type } from 'arktype'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { UrlString } from '$/schema/$Url.ts'
import { YouTubeLiveBroadcastContent } from '$/schema/YouTubeVideo.ts'
import { Source } from '$/sources/$Source.ts'
import type { PipedComment } from '$/sources/Piped/Rest/types.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() || undefined
)

const optionalFiniteNumber = (value: number | undefined) => (
	value != null && Number.isFinite(value) ?
		value
	:
		undefined
)

const optionalUrlString = (value: string | undefined) => {
	const trimmed = optionalTrimmedString(value)
	if (trimmed == null) return undefined
	const parsed = UrlString(trimmed)
	return parsed instanceof type.errors ? undefined : parsed
}

const pipedLiveBroadcastContent = (livestream: boolean | undefined) => (
	livestream === true ?
		YouTubeLiveBroadcastContent.Live
	: livestream === false ?
		YouTubeLiveBroadcastContent.None
	:
		undefined
)

const pipedChannelIdFromCommentorUrl = (commentorUrl: string | undefined) => (
	commentorUrl?.match(/\/channel\/([^/?]+)/)?.[1]
)

const pipedCommentEntityFields = (
	videoId: string,
	comment: PipedComment,
) => ({
	text: optionalTrimmedString(comment.commentText),
	authorDisplayName: optionalTrimmedString(comment.author),
	...((authorChannelId) => (
		authorChannelId != null && {
			authorChannelId,
		}
	))(pipedChannelIdFromCommentorUrl(comment.commentorUrl)),
	...(optionalFiniteNumber(comment.likeCount) != null && {
		likeCount: optionalFiniteNumber(comment.likeCount),
	}),
	...(optionalTrimmedString(comment.commentedTime) != null && {
		publishedAt: optionalTrimmedString(comment.commentedTime),
	}),
	$video: {
		[EntityMetaKey.Id]: { videoId },
	},
})

export default {
	source: Source.Piped_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.YouTubeChannel,
			resolve: async (entityId, context) => {
				const { pipedGetChannel } = await import('$/sources/Piped/Rest/queries.ts')
				const d = await singleFlight(pipedGetChannel)(sourcePublicEnv(context, Source.Piped_Rest), entityId.channelId)
				if (d.id == null) throw new Error('Piped_Rest: channel not found')
				return {
					title: optionalTrimmedString(d.name),
					description: optionalTrimmedString(d.description),
					...(optionalFiniteNumber(d.subscriberCount) != null && {
						subscriberCount: optionalFiniteNumber(d.subscriberCount),
					}),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(optionalTrimmedString(d.avatarUrl), MediaType.Image)),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubeVideo,
			resolve: async (entityId, context) => {
				const {
					pipedChannelIdFromUploaderUrl,
					pipedGetStream,
				} = await import('$/sources/Piped/Rest/queries.ts')
				const d = await singleFlight(pipedGetStream)(sourcePublicEnv(context, Source.Piped_Rest), entityId.videoId)
				if (optionalTrimmedString(d.title) == null) throw new Error('Piped_Rest: video not found')
				const channelId = pipedChannelIdFromUploaderUrl(d.uploaderUrl)
				const thumbnailUrl = optionalUrlString(d.thumbnailUrl)
				const liveBroadcastContent = pipedLiveBroadcastContent(d.livestream)
				return {
					title: optionalTrimmedString(d.title),
					description: optionalTrimmedString(d.description),
					...(optionalTrimmedString(d.uploadDate) != null && {
						publishedAt: optionalTrimmedString(d.uploadDate),
					}),
					...(optionalFiniteNumber(d.views) != null && {
						viewCount: optionalFiniteNumber(d.views),
					}),
					...(optionalFiniteNumber(d.likes) != null && {
						likeCount: optionalFiniteNumber(d.likes),
					}),
					...(optionalFiniteNumber(d.duration) != null && {
						durationSeconds: optionalFiniteNumber(d.duration),
					}),
					...(liveBroadcastContent != null && {
						liveBroadcastContent,
					}),
					$author: (
						channelId == null ?
							undefined
						:	{
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
				const { pipedChannelIdFromUploaderUrl, pipedGetPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
				const d = await singleFlight(pipedGetPlaylist)(sourcePublicEnv(context, Source.Piped_Rest), entityId.playlistId)
				if (optionalTrimmedString(d.name) == null) throw new Error('Piped_Rest: playlist not found')
				const channelId = pipedChannelIdFromUploaderUrl(d.uploaderUrl)
				return {
					title: optionalTrimmedString(d.name),
					...(optionalFiniteNumber(d.videos) != null && {
						itemCount: optionalFiniteNumber(d.videos),
					}),
					$channel: (
						channelId == null ?
							undefined
						:	{
								[EntityMetaKey.Id]: { channelId },
							}
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubeComment,
			resolve: async (entityId, context) => {
				const { pipedListComments } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const page = await singleFlight(pipedListComments)(publicEnv, entityId.videoId, limit)
				if (page.disabled === true) {
					throw new Error(`Piped_Rest: comments disabled for video ${entityId.videoId}`)
				}
				const comment = (page.comments ?? []).find((item) => (
					item.commentId === entityId.commentId
				))
				if (comment == null) throw new Error('Piped_Rest: comment not found')
				return pipedCommentEntityFields(entityId.videoId, comment)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.YouTubeNetwork,
			fieldName: '$$youtubeChannels',
			resolve: async (_entityId, context) => {
				const { pipedChannelIdFromUploaderUrl, pipedListTrending } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					(await singleFlight(pipedListTrending)(publicEnv, limit))
						.flatMap((item) => {
							const channelId = pipedChannelIdFromUploaderUrl(item.uploaderUrl)
							return channelId == null ?
								[]
							:	[{
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
				const { pipedListTrending, pipedVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(pipedListTrending)(publicEnv, limit)))
						.flatMap((item) => (
							((videoId) => (
								videoId == null ?
									[]
								:	[{
										[EntityMetaKey.Id]: { videoId },
									}]
							))(pipedVideoIdFromUrl(item.url))
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
			fieldName: '$$videos',
			resolve: async (entityId, context) => {
				const { pipedListChannelVideos, pipedVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(pipedListChannelVideos)(publicEnv, entityId.channelId, limit)).items ?? [])
						.flatMap((item) => (
							((videoId) => (
								videoId == null ?
									[]
								:	[{
										[EntityMetaKey.Id]: { videoId },
									}]
							))(pipedVideoIdFromUrl(item.url))
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeChannel,
			fieldName: '$$playlists',
			resolve: async (entityId, context) => {
				const {
					pipedListChannelPlaylists,
					pipedPlaylistIdFromUrl,
				} = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(pipedListChannelPlaylists)(publicEnv, entityId.channelId, limit)).items ?? [])
						.flatMap((item) => (
							((playlistId) => (
								playlistId == null ?
									[]
								:	[{
										[EntityMetaKey.Id]: { playlistId },
									}]
							))(pipedPlaylistIdFromUrl(item.url))
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubePlaylist,
			fieldName: '$$videos',
			resolve: async (entityId, context) => {
				const { pipedListPlaylistVideos, pipedVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(pipedListPlaylistVideos)(publicEnv, entityId.playlistId, limit)).items ?? [])
						.flatMap((item) => (
							((videoId) => (
								videoId == null ?
									[]
								:	[{
										[EntityMetaKey.Id]: { videoId },
									}]
							))(pipedVideoIdFromUrl(item.url))
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeVideo,
			fieldName: '$$comments',
			resolve: async (entityId, context) => {
				const { pipedListComments } = await import('$/sources/Piped/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Piped_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const page = await singleFlight(pipedListComments)(publicEnv, entityId.videoId, limit)
				if (page.disabled === true) {
					throw new Error(`Piped_Rest: comments disabled for video ${entityId.videoId}`)
				}
				return (
					(page.comments ?? [])
						.flatMap((comment) => {
							const commentId = optionalTrimmedString(comment.commentId)
							return commentId == null ?
								[]
							:	[{
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
			fieldName: '$$replies',
			resolve: async (entityId, _context) => {
				throw new Error(`Piped_Rest: $$replies unsupported for comment ${entityId.commentId}`)
			},
		}),
	],
}
