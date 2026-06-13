import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { type } from 'arktype'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { YouTubeLiveBroadcastContent } from '$/schema/YouTubeVideo.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { youtubeNetworkSeedChannels } from '$/constants/Social/YouTube.ts'
import { Source } from '$/sources/Source.ts'
import type {
	YoutubeApiChannel,
	YoutubeApiComment,
	YoutubeApiCommentThread,
	YoutubeApiPlaylist,
	YoutubeApiSnippet,
	YoutubeApiThumbnail,
	YoutubeApiVideo,
} from '$/sources/Youtube/Rest/types.ts'


const youtubeThumbnailUrl = (thumbnails: Partial<Record<string, YoutubeApiThumbnail>> | undefined) => (
	optionalNonemptyString(
		thumbnails?.maxres?.url
		?? thumbnails?.standard?.url
		?? thumbnails?.high?.url
		?? thumbnails?.medium?.url
		?? thumbnails?.default?.url,
	)
)

export default {
	source: Source.Youtube_Rest,

	resolvers: [
		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getChannel } = await import('$/sources/Youtube/Rest/queries.ts')
				const d = (await singleFlight(getChannel)(context.publicEnv, entityId.channelId))
					.items?.[0]
				if (d == null) throw new Error('Youtube_Rest: channel not found')
				const customUrl = optionalNonemptyString(d.snippet?.customUrl)
				return {
					title: optionalNonemptyString(d.snippet?.title),
					description: optionalNonemptyString(d.snippet?.description),
					...(customUrl != null && { customUrl }),
					...(d.statistics?.subscriberCount != null && {
						subscriberCount: Number(d.statistics.subscriberCount),
					}),
					...(d.statistics?.videoCount != null && {
						videoCount: Number(d.statistics.videoCount),
					}),
					...(d.statistics?.viewCount != null && {
						viewCount: Number(d.statistics.viewCount),
					}),
					...((publishedAt, publishedAtMs) => (
						{
							...(publishedAt != null && { publishedAt }),
							...(publishedAtMs != null && { publishedAtMs }),
						}
					))(
						optionalNonemptyString(d.snippet?.publishedAt),
						optionalTimestampMs(d.snippet?.publishedAt),
					),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(youtubeThumbnailUrl(d.snippet?.thumbnails), MediaType.Image)),
				}
			}
			},
		})({
				fields: {
				title: (channel) => channel.title,
				description: (channel) => channel.description,
				customUrl: (channel) => channel.customUrl,
				subscriberCount: (channel) => channel.subscriberCount,
				videoCount: (channel) => channel.videoCount,
				viewCount: (channel) => channel.viewCount,
				publishedAt: (channel) => channel.publishedAt,
				publishedAtMs: (channel) => channel.publishedAtMs,
				$icon: (channel) => channel.$icon,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeVideo,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getVideo } = await import('$/sources/Youtube/Rest/queries.ts')
				const d = (await singleFlight(getVideo)(context.publicEnv, entityId.videoId))
					.items?.[0]
				if (d == null) throw new Error('Youtube_Rest: video not found')
				const channelId = optionalNonemptyString(d.snippet?.channelId)
				const thumbnailUrlParsed = (() => {
					const trimmed = youtubeThumbnailUrl(d.snippet?.thumbnails)
					if (trimmed == null) return undefined
					const parsed = UrlString(trimmed)
					return parsed instanceof type.errors ? undefined : parsed
				})()
				const liveBroadcastContentLabel = optionalNonemptyString(d.snippet?.liveBroadcastContent)
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
					const [
						,
						hours = '0',
						minutes = '0',
						seconds = '0',
					] = match
					return (
						Number(hours) * 3600
						+ Number(minutes) * 60
						+ Number(seconds)
					)
				})()
				return {
					title: optionalNonemptyString(d.snippet?.title),
					description: optionalNonemptyString(d.snippet?.description),
					...((publishedAt, publishedAtMs) => (
						{
							...(publishedAt != null && { publishedAt }),
							...(publishedAtMs != null && { publishedAtMs }),
						}
					))(
						optionalNonemptyString(d.snippet?.publishedAt),
						optionalTimestampMs(d.snippet?.publishedAt),
					),
					...(d.statistics?.viewCount != null && {
						viewCount: Number(d.statistics.viewCount),
					}),
					...(d.statistics?.likeCount != null && {
						likeCount: Number(d.statistics.likeCount),
					}),
					...(d.statistics?.commentCount != null && {
						commentCount: Number(d.statistics.commentCount),
					}),
					...((categoryId) => categoryId != null && { categoryId })(
						optionalNonemptyString(d.snippet?.categoryId),
					),
					...(d.snippet?.tags != null && d.snippet.tags.length > 0 && {
						tags: d.snippet.tags,
					}),
					...(liveBroadcastContent != null && { liveBroadcastContent }),
					...(durationSeconds != null && { durationSeconds }),
					$author: (
						channelId == null ?
							undefined
						:
							{
								[EntityMetaKey.Id]: { channelId },
							}
					),
					...(thumbnailUrlParsed != null && { thumbnailUrl: thumbnailUrlParsed }),
				}
			}
			},
		})({
				fields: {
				title: (video) => video.title,
				description: (video) => video.description,
				publishedAt: (video) => video.publishedAt,
				publishedAtMs: (video) => video.publishedAtMs,
				viewCount: (video) => video.viewCount,
				likeCount: (video) => video.likeCount,
				commentCount: (video) => video.commentCount,
				categoryId: (video) => video.categoryId,
				tags: (video) => video.tags,
				liveBroadcastContent: (video) => video.liveBroadcastContent,
				durationSeconds: (video) => video.durationSeconds,
				$author: (video) => video.$author,
				thumbnailUrl: (video) => video.thumbnailUrl,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubePlaylist,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getPlaylist } = await import('$/sources/Youtube/Rest/queries.ts')
				const d = (await singleFlight(getPlaylist)(context.publicEnv, entityId.playlistId))
					.items?.[0]
				if (d == null) throw new Error('Youtube_Rest: playlist not found')
				const channelId = optionalNonemptyString(d.snippet?.channelId)
				return {
					title: optionalNonemptyString(d.snippet?.title),
					description: optionalNonemptyString(d.snippet?.description),
					...(d.contentDetails?.itemCount != null && {
						itemCount: d.contentDetails.itemCount,
					}),
					...((publishedAt, publishedAtMs) => (
						{
							...(publishedAt != null && { publishedAt }),
							...(publishedAtMs != null && { publishedAtMs }),
						}
					))(
						optionalNonemptyString(d.snippet?.publishedAt),
						optionalTimestampMs(d.snippet?.publishedAt),
					),
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
		})({
				fields: {
				title: (playlist) => playlist.title,
				description: (playlist) => playlist.description,
				itemCount: (playlist) => playlist.itemCount,
				publishedAt: (playlist) => playlist.publishedAt,
				publishedAtMs: (playlist) => playlist.publishedAtMs,
				$channel: (playlist) => playlist.$channel,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeComment,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const {
					getComment,
					getCommentThread,
				} = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const d = (await singleFlight(getComment)(publicEnv, entityId.commentId))
					.items?.[0]
				if (d == null) throw new Error('Youtube_Rest: comment not found')
				const snippet = d.snippet
				const videoId = optionalNonemptyString(snippet?.videoId) ?? entityId.videoId
				const parentId = optionalNonemptyString(snippet?.parentId)
				const authorChannelId = (
					typeof snippet?.authorChannelId === 'string' ?
						optionalNonemptyString(snippet.authorChannelId)
					:
						optionalNonemptyString(snippet?.authorChannelId?.value)
				)
				const thread = (
					parentId == null ?
						(await singleFlight(getCommentThread)(publicEnv, entityId.commentId))
							.items?.[0]
					:
						undefined
				)
				const authorDisplayName = optionalNonemptyString(snippet?.authorDisplayName)
				const publishedAt = optionalNonemptyString(snippet?.publishedAt)
				const publishedAtMs = optionalTimestampMs(snippet?.publishedAt)
				return {
					text: optionalNonemptyString(snippet?.textDisplay) ?? optionalNonemptyString(snippet?.textOriginal),
					...(authorDisplayName != null && { authorDisplayName }),
					...(authorChannelId != null && { authorChannelId }),
					...(authorChannelId != null && {
						$author: {
							[EntityMetaKey.Id]: { channelId: authorChannelId },
						},
					}),
					...(d.snippet?.likeCount != null && { likeCount: d.snippet.likeCount }),
					...(thread?.snippet?.totalReplyCount != null && {
						replyCount: thread.snippet.totalReplyCount,
					}),
					...(publishedAt != null && { publishedAt }),
					...(publishedAtMs != null && { publishedAtMs }),
					$video: {
						[EntityMetaKey.Id]: { videoId },
					},
					$parentComment: (
						parentId == null ?
							undefined
						:
							{
								[EntityMetaKey.Id]: {
									videoId,
									commentId: parentId,
								},
							}
					),
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
				replyCount: (comment) => comment.replyCount,
				publishedAt: (comment) => comment.publishedAt,
				publishedAtMs: (comment) => comment.publishedAtMs,
				$video: (comment) => comment.$video,
				$parentComment: (comment) => comment.$parentComment,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeChannel_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getChannel } = await import('$/sources/Youtube/Rest/queries.ts')
				const channel = (await singleFlight(getChannel)(context.publicEnv, entityId.$channel.channelId))
					.items?.[0]
				if (channel == null) throw new Error('Youtube_Rest: channel not found')
				return {
					...(channel.statistics?.subscriberCount != null && {
						subscriberCount: Number(channel.statistics.subscriberCount),
					}),
					...(channel.statistics?.videoCount != null && {
						videoCount: Number(channel.statistics.videoCount),
					}),
					...(channel.statistics?.viewCount != null && {
						viewCount: Number(channel.statistics.viewCount),
					}),
				}
			}
			},
		})({
				fields: {
				subscriberCount: (timestamp) => timestamp.subscriberCount,
				videoCount: (timestamp) => timestamp.videoCount,
				viewCount: (timestamp) => timestamp.viewCount,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeVideo_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getVideo } = await import('$/sources/Youtube/Rest/queries.ts')
				const video = (await singleFlight(getVideo)(context.publicEnv, entityId.$video.videoId))
					.items?.[0]
				if (video == null) throw new Error('Youtube_Rest: video not found')
				return {
					...(video.statistics?.viewCount != null && {
						viewCount: Number(video.statistics.viewCount),
					}),
					...(video.statistics?.likeCount != null && {
						likeCount: Number(video.statistics.likeCount),
					}),
					...(video.statistics?.commentCount != null && {
						commentCount: Number(video.statistics.commentCount),
					}),
				}
			}
			},
		})({
				fields: {
				viewCount: (timestamp) => timestamp.viewCount,
				likeCount: (timestamp) => timestamp.likeCount,
				commentCount: (timestamp) => timestamp.commentCount,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeComment_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const {
					getComment,
					getCommentThread,
				} = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const comment = (await singleFlight(getComment)(publicEnv, entityId.$comment.commentId))
					.items?.[0]
				if (comment == null) throw new Error('Youtube_Rest: comment not found')
				const thread = (
					optionalNonemptyString(comment.snippet?.parentId) == null ?
						(await singleFlight(getCommentThread)(publicEnv, entityId.$comment.commentId))
							.items?.[0]
					:
						undefined
				)
				return {
					...(comment.snippet?.likeCount != null && { likeCount: comment.snippet.likeCount }),
					...(thread?.snippet?.totalReplyCount != null && {
						replyCount: thread.snippet.totalReplyCount,
					}),
				}
			}
			},
		})({
				fields: {
				likeCount: (timestamp) => timestamp.likeCount,
				replyCount: (timestamp) => timestamp.replyCount,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubePlaylist_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getPlaylist } = await import('$/sources/Youtube/Rest/queries.ts')
				const playlist = (await singleFlight(getPlaylist)(context.publicEnv, entityId.$playlist.playlistId))
					.items?.[0]
				if (playlist == null) throw new Error('Youtube_Rest: playlist not found')
				return {
					...(playlist.contentDetails?.itemCount != null && {
						itemCount: playlist.contentDetails.itemCount,
					}),
				}
			}
			},
		})({
				fields: {
				itemCount: (timestamp) => timestamp.itemCount,
			},
			}),
		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { listPopularVideos } = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listPopularVideos)(publicEnv, limit)).items ?? [])
						.flatMap((video) => {
							const channelId = optionalNonemptyString(video.snippet?.channelId)
							if (channelId == null) return []
							return [{
								[EntityMetaKey.Id]: { channelId },
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

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { listPopularVideos } = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listPopularVideos)(publicEnv, limit)).items ?? [])
						.flatMap((video) => (
							video.id == null ?
								[]
							:
								[{
									[EntityMetaKey.Id]: { videoId: video.id },
								}]
						))
				)
			}
			},
		})({
				fields: {
				$$youtubeVideos: (network) => network,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const {
					listChannelPlaylists,
					listPopularVideos,
				} = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
					const channelIds: string[] = [
						...youtubeNetworkSeedChannels.map(({ channelId }) => channelId),
					]
				for (const video of ((await singleFlight(listPopularVideos)(publicEnv, limit)).items ?? [])) {
					const channelId = optionalNonemptyString(video.snippet?.channelId)
					if (channelId != null) channelIds.push(channelId)
				}
				const refs: { [EntityMetaKey.Id]: { playlistId: string } }[] = []
				for (const channelId of channelIds) {
					for (const playlist of ((await singleFlight(listChannelPlaylists)(publicEnv, channelId, limit)).items ?? [])) {
						const playlistId = optionalNonemptyString(playlist.id)
						if (playlistId == null) continue
						refs.push({
							[EntityMetaKey.Id]: { playlistId },
						})
						if (refs.length >= limit) break
					}
					if (refs.length >= limit) break
				}
				return refs.slice(0, limit)
			}
			},
		})({
				fields: {
				$$youtubePlaylists: (network) => network,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getChannel } = await import('$/sources/Youtube/Rest/queries.ts')
				const channel = (await singleFlight(getChannel)(context.publicEnv, entityId.channelId))
					.items?.[0]
				if (channel == null) throw new Error('Youtube_Rest: channel not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$channel: entityId,
							timestampMs: Date.now(),
						},
						...(channel.statistics?.subscriberCount != null && {
							subscriberCount: Number(channel.statistics.subscriberCount),
						}),
						...(channel.statistics?.videoCount != null && {
							videoCount: Number(channel.statistics.videoCount),
						}),
						...(channel.statistics?.viewCount != null && {
							viewCount: Number(channel.statistics.viewCount),
						}),
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (channel) => channel,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { searchChannelVideos } = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(searchChannelVideos)(publicEnv, entityId.channelId, limit)).items ?? [])
						.flatMap((video) => (
							video.id?.videoId == null ?
								[]
							:
								[{
									[EntityMetaKey.Id]: { videoId: video.id.videoId },
								}]
						))
				)
			}
			},
		})({
				fields: {
				$$videos: (channel) => channel,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getChannel } = await import('$/sources/Youtube/Rest/queries.ts')
				const channel = (await singleFlight(getChannel)(context.publicEnv, entityId.channelId))
					.items?.[0]
				if (channel == null) throw new Error('Youtube_Rest: channel not found')
				const count = Number(channel.statistics?.videoCount)
				if (!Number.isInteger(count) || count < 0)
					throw new Error('Youtube_Rest: channel video count not found')
				return count
			}
			},
		})({
				fields: {
				$$videos: {
					resolveCount: (count) => count,
				},
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listChannelPlaylists } = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listChannelPlaylists)(publicEnv, entityId.channelId, limit)).items ?? [])
						.flatMap((video) => (
							video.id == null ?
								[]
							:
								[{
									[EntityMetaKey.Id]: { playlistId: video.id },
								}]
						))
				)
			}
			},
		})({
				fields: {
				$$playlists: (channel) => channel,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubePlaylist,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getPlaylist } = await import('$/sources/Youtube/Rest/queries.ts')
				const playlist = (await singleFlight(getPlaylist)(context.publicEnv, entityId.playlistId))
					.items?.[0]
				if (playlist == null) throw new Error('Youtube_Rest: playlist not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$playlist: entityId,
							timestampMs: Date.now(),
						},
						...(playlist.contentDetails?.itemCount != null && {
						itemCount: playlist.contentDetails.itemCount,
					}),
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (playlist) => playlist,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubePlaylist,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listPlaylistItems } = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listPlaylistItems)(publicEnv, entityId.playlistId, limit)).items ?? [])
						.flatMap((video) => (
							((videoId) => (
								videoId == null ?
									[]
								:
									[{
										[EntityMetaKey.Id]: { videoId },
									}]
							))(
								optionalNonemptyString(video.contentDetails?.videoId)
								?? optionalNonemptyString(video.snippet?.resourceId?.videoId),
							)
						))
				)
			}
			},
		})({
				fields: {
				$$videos: (playlist) => playlist,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubePlaylist,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getPlaylist } = await import('$/sources/Youtube/Rest/queries.ts')
				const playlist = (await singleFlight(getPlaylist)(context.publicEnv, entityId.playlistId))
					.items?.[0]
				if (playlist == null) throw new Error('Youtube_Rest: playlist not found')
				if (playlist.contentDetails?.itemCount == null || playlist.contentDetails.itemCount < 0)
					throw new Error('Youtube_Rest: playlist item count not found')
				return playlist.contentDetails.itemCount
			}
			},
		})({
				fields: {
				$$videos: {
					resolveCount: (count) => count,
				},
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeVideo,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getVideo } = await import('$/sources/Youtube/Rest/queries.ts')
				const video = (await singleFlight(getVideo)(context.publicEnv, entityId.videoId))
					.items?.[0]
				if (video == null) throw new Error('Youtube_Rest: video not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$video: entityId,
							timestampMs: Date.now(),
						},
						...(video.statistics?.viewCount != null && {
							viewCount: Number(video.statistics.viewCount),
						}),
						...(video.statistics?.likeCount != null && {
							likeCount: Number(video.statistics.likeCount),
						}),
						...(video.statistics?.commentCount != null && {
							commentCount: Number(video.statistics.commentCount),
						}),
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (video) => video,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeVideo,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listCommentThreads } = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const limit = resolverContextRowLimit(context)
				const refs: {
					[EntityMetaKey.Id]: {
						videoId: string
						commentId: string
					}
					publishedAtMs?: number
				}[] = []
				let pageToken: string | undefined
				while (refs.length < limit) {
					const page = await singleFlight(listCommentThreads)(
						publicEnv,
						entityId.videoId,
						limit - refs.length,
						pageToken,
					)
					for (const thread of page.items ?? []) {
						const commentId = optionalNonemptyString(thread.snippet?.topLevelComment?.id)
						if (commentId == null) continue
						const publishedAtMs = optionalTimestampMs(
							thread.snippet?.topLevelComment?.snippet?.publishedAt,
						)
						refs.push({
							[EntityMetaKey.Id]: {
								videoId: entityId.videoId,
								commentId,
							},
							...(publishedAtMs != null && { publishedAtMs }),
						})
						if (refs.length >= limit) break
					}
					pageToken = page.nextPageToken
					if (pageToken == null) break
				}
				return refs.slice(0, limit)
			}
			},
		})({
				fields: {
				$$comments: (video) => video,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeVideo,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getVideo } = await import('$/sources/Youtube/Rest/queries.ts')
				const video = (await singleFlight(getVideo)(context.publicEnv, entityId.videoId))
					.items?.[0]
				if (video == null) throw new Error('Youtube_Rest: video not found')
				const count = Number(video.statistics?.commentCount)
				if (!Number.isInteger(count) || count < 0)
					throw new Error('Youtube_Rest: video comment count not found')
				return count
			}
			},
		})({
				fields: {
				$$comments: {
					resolveCount: (count) => count,
				},
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeComment,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const {
					getComment,
					getCommentThread,
				} = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const comment = (await singleFlight(getComment)(publicEnv, entityId.commentId))
					.items?.[0]
				if (comment == null) throw new Error('Youtube_Rest: comment not found')
				const thread = (
					optionalNonemptyString(comment.snippet?.parentId) == null ?
						(await singleFlight(getCommentThread)(publicEnv, entityId.commentId))
							.items?.[0]
					:
						undefined
				)
				const replyCount = thread?.snippet?.totalReplyCount
				return [
					{
						[EntityMetaKey.Id]: {
							$comment: entityId,
							timestampMs: Date.now(),
						},
						...(comment.snippet?.likeCount != null && { likeCount: comment.snippet.likeCount }),
						...(replyCount != null && { replyCount }),
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (comment) => comment,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeComment,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const {
					getComment,
					listCommentReplies,
				} = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const parent = (await singleFlight(getComment)(publicEnv, entityId.commentId))
					.items?.[0]
				if (parent?.snippet?.parentId != null && parent.snippet.parentId !== '') return []
				const limit = resolverContextRowLimit(context)
				const refs: {
					[EntityMetaKey.Id]: {
						videoId: string
						commentId: string
					}
					publishedAtMs?: number
				}[] = []
				let pageToken: string | undefined
				while (refs.length < limit) {
					const page = await singleFlight(listCommentReplies)(
						publicEnv,
						entityId.commentId,
						limit - refs.length,
						pageToken,
					)
					for (const video of page.items ?? []) {
						const commentId = optionalNonemptyString(video.id)
						if (commentId == null) continue
						const publishedAtMs = optionalTimestampMs(video.snippet?.publishedAt)
						refs.push({
							[EntityMetaKey.Id]: {
								videoId: entityId.videoId,
								commentId,
							},
							...(publishedAtMs != null && { publishedAtMs }),
						})
						if (refs.length >= limit) break
					}
					pageToken = page.nextPageToken
					if (pageToken == null) break
				}
				return refs.slice(0, limit)
			}
			},
		})({
				fields: {
				$$replies: (comment) => comment,
			},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YouTubeComment,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const {
					getComment,
					getCommentThread,
				} = await import('$/sources/Youtube/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const comment = (await singleFlight(getComment)(publicEnv, entityId.commentId))
					.items?.[0]
				if (comment == null) throw new Error('Youtube_Rest: comment not found')
				if (optionalNonemptyString(comment.snippet?.parentId) != null) return 0
				const thread = (await singleFlight(getCommentThread)(publicEnv, entityId.commentId))
					.items?.[0]
				if (thread?.snippet?.totalReplyCount == null || thread.snippet.totalReplyCount < 0)
					throw new Error('Youtube_Rest: comment reply count not found')
				return thread.snippet.totalReplyCount
			}
			},
		})({
				fields: {
				$$replies: {
					resolveCount: (count) => count,
				},
			},
			}),
	],
}
