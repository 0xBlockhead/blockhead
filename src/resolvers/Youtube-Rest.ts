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
import { YouTubeLiveBroadcastContent } from '$/schema/YouTubeVideo.ts'
import { UrlString } from '$/schema/$Url.ts'
import { youtubeNetworkSeedChannels } from '$/constants/Social/YouTube.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	YoutubeApiCommentSnippetWire,
	YoutubeApiSnippetWire,
} from '$/sources/Youtube/Rest/types.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() ? value.trim() : undefined
)

const optionalCountString = (value: string | undefined) => (
	((parsed) => (
		Number.isFinite(parsed) ? parsed : undefined
	))(Number(value ?? ''))
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

const youtubeThumbnailUrl = (thumbnails: YoutubeApiSnippetWire['thumbnails']) => (
	optionalTrimmedString(
		thumbnails?.maxres?.url
		?? thumbnails?.standard?.url
		?? thumbnails?.high?.url
		?? thumbnails?.medium?.url
		?? thumbnails?.default?.url,
	)
)

const optionalIso8601DurationSeconds = (value: string | undefined) => {
	if (value == null || !value.startsWith('PT')) return undefined
	const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(value)
	if (match == null) return undefined
	return (
		Number(match[1] ?? 0) * 3600
		+ Number(match[2] ?? 0) * 60
		+ Number(match[3] ?? 0)
	)
}

const optionalAuthorChannelId = (value: YoutubeApiCommentSnippetWire['authorChannelId']) => (
	typeof value === 'string' ?
		optionalTrimmedString(value)
	:	optionalTrimmedString(value?.value)
)

const youtubeLiveBroadcastContent = (value: string | undefined) => (
	optionalTrimmedString(value) === YouTubeLiveBroadcastContent.Live ?
		YouTubeLiveBroadcastContent.Live
	: optionalTrimmedString(value) === YouTubeLiveBroadcastContent.Upcoming ?
		YouTubeLiveBroadcastContent.Upcoming
	: optionalTrimmedString(value) === YouTubeLiveBroadcastContent.None ?
		YouTubeLiveBroadcastContent.None
	:
		undefined
)

const youtubeCommentEntityId = (
	videoId: string,
	commentId: string | undefined,
) => (
	commentId == null ?
		undefined
	:	{
			[EntityMetaKey.Id]: {
				videoId,
				commentId,
			},
		}
)

export default {
	source: Source.Youtube_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.YouTubeChannel,
			resolve: async (entityId, context) => {
				const { youtubeGetChannel } = await import('$/sources/Youtube/Rest/queries.ts')
				const d = (await singleFlight(youtubeGetChannel)(sourcePublicEnv(context, Source.Youtube_Rest), entityId.channelId))
					.items?.[0]
				if (d == null) throw new Error('Youtube_Rest: channel not found')
				return {
					title: optionalTrimmedString(d.snippet?.title),
					description: optionalTrimmedString(d.snippet?.description),
					...(optionalTrimmedString(d.snippet?.customUrl) != null && {
						customUrl: optionalTrimmedString(d.snippet?.customUrl),
					}),
					...(optionalCountString(d.statistics?.subscriberCount) != null && {
						subscriberCount: optionalCountString(d.statistics?.subscriberCount),
					}),
					...(optionalCountString(d.statistics?.videoCount) != null && {
						videoCount: optionalCountString(d.statistics?.videoCount),
					}),
					...(optionalCountString(d.statistics?.viewCount) != null && {
						viewCount: optionalCountString(d.statistics?.viewCount),
					}),
					...(optionalTrimmedString(d.snippet?.publishedAt) != null && {
						publishedAt: optionalTrimmedString(d.snippet?.publishedAt),
					}),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(youtubeThumbnailUrl(d.snippet?.thumbnails), MediaType.Image)),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubeVideo,
			resolve: async (entityId, context) => {
				const { youtubeGetVideo } = await import('$/sources/Youtube/Rest/queries.ts')
				const d = (await singleFlight(youtubeGetVideo)(sourcePublicEnv(context, Source.Youtube_Rest), entityId.videoId))
					.items?.[0]
				if (d == null) throw new Error('Youtube_Rest: video not found')
				const channelId = optionalTrimmedString(d.snippet?.channelId)
				const thumbnailUrl = optionalUrlString(youtubeThumbnailUrl(d.snippet?.thumbnails))
				const liveBroadcastContent = youtubeLiveBroadcastContent(d.snippet?.liveBroadcastContent)
				return {
					title: optionalTrimmedString(d.snippet?.title),
					description: optionalTrimmedString(d.snippet?.description),
					...(optionalTrimmedString(d.snippet?.publishedAt) != null && {
						publishedAt: optionalTrimmedString(d.snippet?.publishedAt),
					}),
					...(optionalCountString(d.statistics?.viewCount) != null && {
						viewCount: optionalCountString(d.statistics?.viewCount),
					}),
					...(optionalCountString(d.statistics?.likeCount) != null && {
						likeCount: optionalCountString(d.statistics?.likeCount),
					}),
					...(optionalCountString(d.statistics?.commentCount) != null && {
						commentCount: optionalCountString(d.statistics?.commentCount),
					}),
					...(optionalTrimmedString(d.snippet?.categoryId) != null && {
						categoryId: optionalTrimmedString(d.snippet?.categoryId),
					}),
					...(liveBroadcastContent != null && { liveBroadcastContent }),
					...(optionalIso8601DurationSeconds(d.contentDetails?.duration) != null && {
						durationSeconds: optionalIso8601DurationSeconds(d.contentDetails?.duration),
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
				const { youtubeGetPlaylist } = await import('$/sources/Youtube/Rest/queries.ts')
				const d = (await singleFlight(youtubeGetPlaylist)(sourcePublicEnv(context, Source.Youtube_Rest), entityId.playlistId))
					.items?.[0]
				if (d == null) throw new Error('Youtube_Rest: playlist not found')
				const channelId = optionalTrimmedString(d.snippet?.channelId)
				return {
					title: optionalTrimmedString(d.snippet?.title),
					description: optionalTrimmedString(d.snippet?.description),
					...(optionalFiniteNumber(d.contentDetails?.itemCount) != null && {
						itemCount: optionalFiniteNumber(d.contentDetails?.itemCount),
					}),
					...(optionalTrimmedString(d.snippet?.publishedAt) != null && {
						publishedAt: optionalTrimmedString(d.snippet?.publishedAt),
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
				const { youtubeGetComment } = await import('$/sources/Youtube/Rest/queries.ts')
				const d = (await singleFlight(youtubeGetComment)(sourcePublicEnv(context, Source.Youtube_Rest), entityId.commentId))
					.items?.[0]
				if (d == null) throw new Error('Youtube_Rest: comment not found')
				const snippet = d.snippet
				const videoId = optionalTrimmedString(snippet?.videoId) ?? entityId.videoId
				const parentId = optionalTrimmedString(snippet?.parentId)
				const authorChannelId = optionalAuthorChannelId(snippet?.authorChannelId)
				return {
					text: optionalTrimmedString(snippet?.textDisplay) ?? optionalTrimmedString(snippet?.textOriginal),
					...(optionalTrimmedString(snippet?.authorDisplayName) != null && {
						authorDisplayName: optionalTrimmedString(snippet?.authorDisplayName),
					}),
					...(authorChannelId != null && { authorChannelId }),
					...(optionalFiniteNumber(snippet?.likeCount) != null && {
						likeCount: optionalFiniteNumber(snippet?.likeCount),
					}),
					...(optionalTrimmedString(snippet?.publishedAt) != null && {
						publishedAt: optionalTrimmedString(snippet?.publishedAt),
					}),
					$video: {
						[EntityMetaKey.Id]: { videoId },
					},
					$parentComment: youtubeCommentEntityId(videoId, parentId),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.YouTubeNetwork,
			fieldName: '$$youtubeChannels',
			resolve: async (_entityId, context) => {
				const { youtubeListPopularVideos } = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Youtube_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const byChannelId = new Map<string, { [EntityMetaKey.Id]: { channelId: string } }>()
				for (const item of ((await singleFlight(youtubeListPopularVideos)(publicEnv, limit)).items ?? [])) {
					const channelId = optionalTrimmedString(item.snippet?.channelId)
					if (channelId == null) continue
					byChannelId.set(channelId, {
						[EntityMetaKey.Id]: { channelId },
					})
				}
				return [...byChannelId.values()]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeNetwork,
			fieldName: '$$youtubeVideos',
			resolve: async (_entityId, context) => {
				const { youtubeListPopularVideos } = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Youtube_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(youtubeListPopularVideos)(publicEnv, limit)).items ?? [])
						.flatMap((item) => (
							item.id == null ?
								[]
							:	[{
									[EntityMetaKey.Id]: { videoId: item.id },
								}]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeNetwork,
			fieldName: '$$youtubePlaylists',
			resolve: async (_entityId, context) => {
				const {
					youtubeListChannelPlaylists,
					youtubeListPopularVideos,
				} = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Youtube_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const channelIds = new Set(
					youtubeNetworkSeedChannels.map(({ channelId }) => channelId),
				)
				for (const item of ((await singleFlight(youtubeListPopularVideos)(publicEnv, limit)).items ?? [])) {
					const channelId = optionalTrimmedString(item.snippet?.channelId)
					if (channelId != null) channelIds.add(channelId)
				}
				const byPlaylistId = new Map<string, { [EntityMetaKey.Id]: { playlistId: string } }>()
				for (const channelId of channelIds) {
					for (const playlist of ((await singleFlight(youtubeListChannelPlaylists)(publicEnv, channelId, limit)).items ?? [])) {
						const playlistId = optionalTrimmedString(playlist.id)
						if (playlistId == null) continue
						byPlaylistId.set(playlistId, {
							[EntityMetaKey.Id]: { playlistId },
						})
					}
				}
				return [...byPlaylistId.values()]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeChannel,
			fieldName: '$$videos',
			resolve: async (entityId, context) => {
				const { youtubeSearchChannelVideos } = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Youtube_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(youtubeSearchChannelVideos)(publicEnv, entityId.channelId, limit)).items ?? [])
						.flatMap((item) => (
							item.id?.videoId == null ?
								[]
							:	[{
									[EntityMetaKey.Id]: { videoId: item.id.videoId },
								}]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeChannel,
			fieldName: '$$playlists',
			resolve: async (entityId, context) => {
				const { youtubeListChannelPlaylists } = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Youtube_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(youtubeListChannelPlaylists)(publicEnv, entityId.channelId, limit)).items ?? [])
						.flatMap((item) => (
							item.id == null ?
								[]
							:	[{
									[EntityMetaKey.Id]: { playlistId: item.id },
								}]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubePlaylist,
			fieldName: '$$videos',
			resolve: async (entityId, context) => {
				const { youtubeListPlaylistItems } = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Youtube_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(youtubeListPlaylistItems)(publicEnv, entityId.playlistId, limit)).items ?? [])
						.flatMap((item) => (
							((videoId) => (
								videoId == null ?
									[]
								:	[{
										[EntityMetaKey.Id]: { videoId },
									}]
							))(
								optionalTrimmedString(item.contentDetails?.videoId)
								?? optionalTrimmedString(item.snippet?.resourceId?.videoId),
							)
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeVideo,
			fieldName: '$$comments',
			resolve: async (entityId, context) => {
				const { youtubeListCommentThreads } = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Youtube_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(youtubeListCommentThreads)(publicEnv, entityId.videoId, limit)).items ?? [])
						.flatMap((thread) => (
							((commentRef) => (
								commentRef == null ?
									[]
								:	[commentRef]
							))(
								youtubeCommentEntityId(
									entityId.videoId,
									optionalTrimmedString(thread.snippet?.topLevelComment?.id),
								),
							)
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeComment,
			fieldName: '$$replies',
			resolve: async (entityId, context) => {
				const { youtubeListCommentReplies } = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Youtube_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(youtubeListCommentReplies)(publicEnv, entityId.commentId, limit)).items ?? [])
						.flatMap((item) => (
							((commentRef) => (
								commentRef == null ?
									[]
								:	[commentRef]
							))(
								youtubeCommentEntityId(entityId.videoId, optionalTrimmedString(item.id)),
							)
						))
				)
			},
		}),
	],
}
