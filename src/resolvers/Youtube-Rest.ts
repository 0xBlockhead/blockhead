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
	YoutubeApiChannel,
	YoutubeApiComment,
	YoutubeApiCommentThread,
	YoutubeApiPlaylist,
	YoutubeApiSnippet,
	YoutubeApiVideo,
} from '$/sources/Youtube/Rest/types.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() || undefined
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

const optionalTimestampMs = (value: string | undefined) => (
	((parsed) => (
		Number.isFinite(parsed) ?
			parsed
		:
			undefined
	))(Date.parse(value ?? ''))
)

const youtubeThumbnailUrl = (thumbnails: YoutubeApiSnippet['thumbnails']) => (
	optionalTrimmedString(
		thumbnails?.maxres?.url
		?? thumbnails?.standard?.url
		?? thumbnails?.high?.url
		?? thumbnails?.medium?.url
		?? thumbnails?.default?.url,
	)
)

const youtubeChannelTimestampFieldsFromChannel = (
	channel: YoutubeApiChannel,
) => ({
	subscriberCount: optionalCountString(channel.statistics?.subscriberCount),
	videoCount: optionalCountString(channel.statistics?.videoCount),
	viewCount: optionalCountString(channel.statistics?.viewCount),
})

const youtubeVideoTimestampFieldsFromVideo = (
	video: YoutubeApiVideo,
) => ({
	viewCount: optionalCountString(video.statistics?.viewCount),
	likeCount: optionalCountString(video.statistics?.likeCount),
	commentCount: optionalCountString(video.statistics?.commentCount),
})

const youtubePlaylistTimestampFieldsFromPlaylist = (
	playlist: YoutubeApiPlaylist,
) => ({
	itemCount: optionalFiniteNumber(playlist.contentDetails?.itemCount),
})

const youtubeCommentTimestampFieldsFromComment = (
	comment: YoutubeApiComment,
	thread: YoutubeApiCommentThread | undefined,
) => ({
	likeCount: optionalFiniteNumber(comment.snippet?.likeCount),
	replyCount: optionalFiniteNumber(thread?.snippet?.totalReplyCount),
})

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
					...youtubeChannelTimestampFieldsFromChannel(d),
					...(optionalTrimmedString(d.snippet?.publishedAt) != null && {
						publishedAt: optionalTrimmedString(d.snippet?.publishedAt),
					}),
					...(optionalTimestampMs(d.snippet?.publishedAt) != null && {
						publishedAtMs: optionalTimestampMs(d.snippet?.publishedAt),
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
				const thumbnailUrlParsed = (() => {
					const trimmed = youtubeThumbnailUrl(d.snippet?.thumbnails)
					if (trimmed == null) return undefined
					const parsed = UrlString(trimmed)
					return parsed instanceof type.errors ? undefined : parsed
				})()
				const liveBroadcastContentLabel = optionalTrimmedString(d.snippet?.liveBroadcastContent)
				const liveBroadcastContent = (
					liveBroadcastContentLabel === YouTubeLiveBroadcastContent.Live ?
						YouTubeLiveBroadcastContent.Live
					: liveBroadcastContentLabel === YouTubeLiveBroadcastContent.Upcoming ?
						YouTubeLiveBroadcastContent.Upcoming
					: liveBroadcastContentLabel === YouTubeLiveBroadcastContent.None ?
						YouTubeLiveBroadcastContent.None
					:
						undefined
				)
				const durationSeconds = (() => {
					const value = d.contentDetails?.duration
					if (value == null || !value.startsWith('PT')) return undefined
					const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(value)
					if (match == null) return undefined
					return (
						Number(match[1] ?? 0) * 3600
						+ Number(match[2] ?? 0) * 60
						+ Number(match[3] ?? 0)
					)
				})()
				return {
					title: optionalTrimmedString(d.snippet?.title),
					description: optionalTrimmedString(d.snippet?.description),
					...(optionalTrimmedString(d.snippet?.publishedAt) != null && {
						publishedAt: optionalTrimmedString(d.snippet?.publishedAt),
					}),
					...(optionalTimestampMs(d.snippet?.publishedAt) != null && {
						publishedAtMs: optionalTimestampMs(d.snippet?.publishedAt),
					}),
					...youtubeVideoTimestampFieldsFromVideo(d),
					...(optionalTrimmedString(d.snippet?.categoryId) != null && {
						categoryId: optionalTrimmedString(d.snippet?.categoryId),
					}),
					...(d.snippet?.tags != null && d.snippet.tags.length > 0 && {
						tags: d.snippet.tags,
					}),
					...(liveBroadcastContent != null && { liveBroadcastContent }),
					...(durationSeconds != null && { durationSeconds }),
					$author: (
						channelId == null ?
							undefined
						:	{
								[EntityMetaKey.Id]: { channelId },
							}
					),
					...(thumbnailUrlParsed != null && { thumbnailUrl: thumbnailUrlParsed }),
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
					...youtubePlaylistTimestampFieldsFromPlaylist(d),
					...(optionalTrimmedString(d.snippet?.publishedAt) != null && {
						publishedAt: optionalTrimmedString(d.snippet?.publishedAt),
					}),
					...(optionalTimestampMs(d.snippet?.publishedAt) != null && {
						publishedAtMs: optionalTimestampMs(d.snippet?.publishedAt),
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
				const {
					youtubeGetComment,
					youtubeGetCommentThread,
				} = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Youtube_Rest)
				const d = (await singleFlight(youtubeGetComment)(publicEnv, entityId.commentId))
					.items?.[0]
				if (d == null) throw new Error('Youtube_Rest: comment not found')
				const snippet = d.snippet
				const videoId = optionalTrimmedString(snippet?.videoId) ?? entityId.videoId
				const parentId = optionalTrimmedString(snippet?.parentId)
				const authorChannelId = (
					typeof snippet?.authorChannelId === 'string' ?
						optionalTrimmedString(snippet.authorChannelId)
					:	optionalTrimmedString(snippet?.authorChannelId?.value)
				)
				const thread = (
					parentId == null ?
						(await singleFlight(youtubeGetCommentThread)(publicEnv, entityId.commentId))
							.items?.[0]
					:
						undefined
				)
				return {
					text: optionalTrimmedString(snippet?.textDisplay) ?? optionalTrimmedString(snippet?.textOriginal),
					...(optionalTrimmedString(snippet?.authorDisplayName) != null && {
						authorDisplayName: optionalTrimmedString(snippet?.authorDisplayName),
					}),
					...(authorChannelId != null && { authorChannelId }),
					...(authorChannelId != null && {
						$author: {
							[EntityMetaKey.Id]: { channelId: authorChannelId },
						},
					}),
					...youtubeCommentTimestampFieldsFromComment(d, thread),
					...(optionalTrimmedString(snippet?.publishedAt) != null && {
						publishedAt: optionalTrimmedString(snippet?.publishedAt),
					}),
					...(optionalTimestampMs(snippet?.publishedAt) != null && {
						publishedAtMs: optionalTimestampMs(snippet?.publishedAt),
					}),
					$video: {
						[EntityMetaKey.Id]: { videoId },
					},
					$parentComment: (
						parentId == null ?
							undefined
						:	{
								[EntityMetaKey.Id]: {
									videoId,
									commentId: parentId,
								},
							}
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubeChannel_Timestamp,
			resolve: async (entityId, context) => {
				const { youtubeGetChannel } = await import('$/sources/Youtube/Rest/queries.ts')
				const channel = (await singleFlight(youtubeGetChannel)(sourcePublicEnv(context, Source.Youtube_Rest), entityId.$channel.channelId))
					.items?.[0]
				if (channel == null) throw new Error('Youtube_Rest: channel not found')
				return youtubeChannelTimestampFieldsFromChannel(channel)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubeVideo_Timestamp,
			resolve: async (entityId, context) => {
				const { youtubeGetVideo } = await import('$/sources/Youtube/Rest/queries.ts')
				const video = (await singleFlight(youtubeGetVideo)(sourcePublicEnv(context, Source.Youtube_Rest), entityId.$video.videoId))
					.items?.[0]
				if (video == null) throw new Error('Youtube_Rest: video not found')
				return youtubeVideoTimestampFieldsFromVideo(video)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubeComment_Timestamp,
			resolve: async (entityId, context) => {
				const {
					youtubeGetComment,
					youtubeGetCommentThread,
				} = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Youtube_Rest)
				const comment = (await singleFlight(youtubeGetComment)(publicEnv, entityId.$comment.commentId))
					.items?.[0]
				if (comment == null) throw new Error('Youtube_Rest: comment not found')
				return youtubeCommentTimestampFieldsFromComment(
					comment,
					optionalTrimmedString(comment.snippet?.parentId) == null ?
						(await singleFlight(youtubeGetCommentThread)(publicEnv, entityId.$comment.commentId))
							.items?.[0]
					:
						undefined,
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubePlaylist_Timestamp,
			resolve: async (entityId, context) => {
				const { youtubeGetPlaylist } = await import('$/sources/Youtube/Rest/queries.ts')
				const playlist = (await singleFlight(youtubeGetPlaylist)(sourcePublicEnv(context, Source.Youtube_Rest), entityId.$playlist.playlistId))
					.items?.[0]
				if (playlist == null) throw new Error('Youtube_Rest: playlist not found')
				return youtubePlaylistTimestampFieldsFromPlaylist(playlist)
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
				return (
					((await singleFlight(youtubeListPopularVideos)(publicEnv, limit)).items ?? [])
						.flatMap((item) => {
							const channelId = optionalTrimmedString(item.snippet?.channelId)
							if (channelId == null) return []
							return [{
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
					const channelIds: string[] = [
						...youtubeNetworkSeedChannels.map(({ channelId }) => channelId),
					]
				for (const item of ((await singleFlight(youtubeListPopularVideos)(publicEnv, limit)).items ?? [])) {
					const channelId = optionalTrimmedString(item.snippet?.channelId)
					if (channelId != null) channelIds.push(channelId)
				}
				const refs: { [EntityMetaKey.Id]: { playlistId: string } }[] = []
				for (const channelId of channelIds) {
					for (const playlist of ((await singleFlight(youtubeListChannelPlaylists)(publicEnv, channelId, limit)).items ?? [])) {
						const playlistId = optionalTrimmedString(playlist.id)
						if (playlistId == null) continue
						refs.push({
							[EntityMetaKey.Id]: { playlistId },
						})
						if (refs.length >= limit) break
					}
					if (refs.length >= limit) break
				}
				return refs.slice(0, limit)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeChannel,
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const { youtubeGetChannel } = await import('$/sources/Youtube/Rest/queries.ts')
				const channel = (await singleFlight(youtubeGetChannel)(sourcePublicEnv(context, Source.Youtube_Rest), entityId.channelId))
					.items?.[0]
				if (channel == null) throw new Error('Youtube_Rest: channel not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$channel: entityId,
							timestampMs: Date.now(),
						},
						...youtubeChannelTimestampFieldsFromChannel(channel),
					},
				]
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
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const { youtubeGetPlaylist } = await import('$/sources/Youtube/Rest/queries.ts')
				const playlist = (await singleFlight(youtubeGetPlaylist)(sourcePublicEnv(context, Source.Youtube_Rest), entityId.playlistId))
					.items?.[0]
				if (playlist == null) throw new Error('Youtube_Rest: playlist not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$playlist: entityId,
							timestampMs: Date.now(),
						},
						...youtubePlaylistTimestampFieldsFromPlaylist(playlist),
					},
				]
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
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const { youtubeGetVideo } = await import('$/sources/Youtube/Rest/queries.ts')
				const video = (await singleFlight(youtubeGetVideo)(sourcePublicEnv(context, Source.Youtube_Rest), entityId.videoId))
					.items?.[0]
				if (video == null) throw new Error('Youtube_Rest: video not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$video: entityId,
							timestampMs: Date.now(),
						},
						...youtubeVideoTimestampFieldsFromVideo(video),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeVideo,
			fieldName: '$$comments',
			resolve: async (entityId, context) => {
				const { youtubeListCommentThreads } = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Youtube_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const refs: {
					[EntityMetaKey.Id]: {
						videoId: string
						commentId: string
					}
					publishedAtMs?: number
				}[] = []
				let pageToken: string | undefined
				while (refs.length < limit) {
					const page = await singleFlight(youtubeListCommentThreads)(
						publicEnv,
						entityId.videoId,
						limit - refs.length,
						pageToken,
					)
					for (const thread of page.items ?? []) {
						const commentId = optionalTrimmedString(thread.snippet?.topLevelComment?.id)
						if (commentId == null) continue
						refs.push({
							[EntityMetaKey.Id]: {
								videoId: entityId.videoId,
								commentId,
							},
							...(optionalTimestampMs(thread.snippet?.topLevelComment?.snippet?.publishedAt) != null && {
								publishedAtMs: optionalTimestampMs(thread.snippet?.topLevelComment?.snippet?.publishedAt),
							}),
						})
						if (refs.length >= limit) break
					}
					pageToken = page.nextPageToken
					if (pageToken == null) break
				}
				return refs.slice(0, limit)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeComment,
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const {
					youtubeGetComment,
					youtubeGetCommentThread,
				} = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Youtube_Rest)
				const comment = (await singleFlight(youtubeGetComment)(publicEnv, entityId.commentId))
					.items?.[0]
				if (comment == null) throw new Error('Youtube_Rest: comment not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$comment: entityId,
							timestampMs: Date.now(),
						},
						...youtubeCommentTimestampFieldsFromComment(
							comment,
							optionalTrimmedString(comment.snippet?.parentId) == null ?
								(await singleFlight(youtubeGetCommentThread)(publicEnv, entityId.commentId))
									.items?.[0]
							:
								undefined,
						),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeComment,
			fieldName: '$$replies',
			resolve: async (entityId, context) => {
				const {
					youtubeGetComment,
					youtubeListCommentReplies,
				} = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Youtube_Rest)
				const parent = (await singleFlight(youtubeGetComment)(publicEnv, entityId.commentId))
					.items?.[0]
				if (optionalTrimmedString(parent?.snippet?.parentId) != null) return []
				const limit = resolverLoadSubsetRowLimit(context)
				const refs: {
					[EntityMetaKey.Id]: {
						videoId: string
						commentId: string
					}
					publishedAtMs?: number
				}[] = []
				let pageToken: string | undefined
				while (refs.length < limit) {
					const page = await singleFlight(youtubeListCommentReplies)(
						publicEnv,
						entityId.commentId,
						limit - refs.length,
						pageToken,
					)
					for (const item of page.items ?? []) {
						const commentId = optionalTrimmedString(item.id)
						if (commentId == null) continue
						refs.push({
							[EntityMetaKey.Id]: {
								videoId: entityId.videoId,
								commentId,
							},
							...(optionalTimestampMs(item.snippet?.publishedAt) != null && {
								publishedAtMs: optionalTimestampMs(item.snippet?.publishedAt),
							}),
						})
						if (refs.length >= limit) break
					}
					pageToken = page.nextPageToken
					if (pageToken == null) break
				}
				return refs.slice(0, limit)
			},
		}),
	],
}
