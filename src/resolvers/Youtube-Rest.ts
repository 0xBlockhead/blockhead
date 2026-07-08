import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { type } from 'arktype'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { YoutubeLiveBroadcastContent } from '$/schema/YoutubeVideo.ts'
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
import { YoutubeChannelSelector } from '$/schema/YoutubeChannel.ts'
import { YoutubeVideoSelector } from '$/schema/YoutubeVideo.ts'
import { YoutubePlaylistSelector } from '$/schema/YoutubePlaylist.ts'
import { YoutubeCommentSelector } from '$/schema/YoutubeComment.ts'
import { YoutubeChannel_TimestampSelector } from '$/schema/YoutubeChannel_Timestamp.ts'
import { YoutubeVideo_TimestampSelector } from '$/schema/YoutubeVideo_Timestamp.ts'
import { YoutubeComment_TimestampSelector } from '$/schema/YoutubeComment_Timestamp.ts'
import { YoutubePlaylist_TimestampSelector } from '$/schema/YoutubePlaylist_Timestamp.ts'
import { _GlobalYoutubeNetworkSelector } from '$/schema/_GlobalYoutubeNetwork.ts'


const youtubeThumbnailUrl = (thumbnails: Partial<Record<string, YoutubeApiThumbnail>> | undefined) => (
	optionalNonemptyString(
		thumbnails?.maxres?.url
		?? thumbnails?.standard?.url
		?? thumbnails?.high?.url
		?? thumbnails?.medium?.url
		?? thumbnails?.default?.url
	)
)

export default {
	source: Source.Youtube_Rest,

	resolvers: [
		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeChannel,
			resolve: {
				[YoutubeChannelSelector.ChannelId]: async ({ channelId }, context) => {
					const { getChannel } = await import('$/sources/Youtube/Rest/queries.ts')
					const d = (await getChannel(context.publicEnv, channelId))
						.items?.[0]
					if (d == null) throw new Error('Youtube_Rest: channel not found')
					const customUrl = optionalNonemptyString(d.snippet?.customUrl)
					const publishedAt = optionalNonemptyString(d.snippet?.publishedAt)
					const publishedAtMs = optionalTimestampMs(d.snippet?.publishedAt)
					const iconMedia = mediaFromUrl(youtubeThumbnailUrl(d.snippet?.thumbnails), MediaType.Image)
					return {
						title: optionalNonemptyString(d.snippet?.title),
						description: optionalNonemptyString(d.snippet?.description),
						...(customUrl != null && { customUrl }),
						...(publishedAt != null && { publishedAt }),
						...(publishedAtMs != null && { publishedAtMs }),
						...(iconMedia != null && {
							$icon: iconMedia,
						}),
					}
				}
			},
		})({
				title: (channel) => channel.title,
				description: (channel) => channel.description,
				customUrl: (channel) => channel.customUrl,
				publishedAt: (channel) => channel.publishedAt,
				publishedAtMs: (channel) => channel.publishedAtMs,
				$icon: (channel) => channel.$icon,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeVideo,
			resolve: {
				[YoutubeVideoSelector.VideoId]: async ({ videoId }, context) => {
					const { getVideo } = await import('$/sources/Youtube/Rest/queries.ts')
					const d = (await getVideo(context.publicEnv, videoId))
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
						liveBroadcastContentLabel === YoutubeLiveBroadcastContent.Live ?
							YoutubeLiveBroadcastContent.Live
						:
							liveBroadcastContentLabel === YoutubeLiveBroadcastContent.Upcoming ?
								YoutubeLiveBroadcastContent.Upcoming
							:
								liveBroadcastContentLabel === YoutubeLiveBroadcastContent.None ?
									YoutubeLiveBroadcastContent.None
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
					const publishedAt = optionalNonemptyString(d.snippet?.publishedAt)
					const publishedAtMs = optionalTimestampMs(d.snippet?.publishedAt)
					const categoryId = optionalNonemptyString(d.snippet?.categoryId)
					return {
						title: optionalNonemptyString(d.snippet?.title),
						description: optionalNonemptyString(d.snippet?.description),
						...(publishedAt != null && { publishedAt }),
						...(publishedAtMs != null && { publishedAtMs }),
						...(categoryId != null && { categoryId }),
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
									[EntityMetaKey.Selector]: { channelId },
								}
						),
						...(thumbnailUrlParsed != null && { thumbnailUrl: thumbnailUrlParsed }),
					}
				}
			},
		})({
				title: (video) => video.title,
				description: (video) => video.description,
				publishedAt: (video) => video.publishedAt,
				publishedAtMs: (video) => video.publishedAtMs,
				categoryId: (video) => video.categoryId,
				tags: (video) => video.tags,
				liveBroadcastContent: (video) => video.liveBroadcastContent,
				durationSeconds: (video) => video.durationSeconds,
				$author: (video) => video.$author,
				thumbnailUrl: (video) => video.thumbnailUrl,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubePlaylist,
			resolve: {
				[YoutubePlaylistSelector.PlaylistId]: async ({ playlistId }, context) => {
					const { getPlaylist } = await import('$/sources/Youtube/Rest/queries.ts')
					const d = (await getPlaylist(context.publicEnv, playlistId))
						.items?.[0]
					if (d == null) throw new Error('Youtube_Rest: playlist not found')
					const channelId = optionalNonemptyString(d.snippet?.channelId)
					const publishedAt = optionalNonemptyString(d.snippet?.publishedAt)
					const publishedAtMs = optionalTimestampMs(d.snippet?.publishedAt)
					return {
						title: optionalNonemptyString(d.snippet?.title),
						description: optionalNonemptyString(d.snippet?.description),
						...(publishedAt != null && { publishedAt }),
						...(publishedAtMs != null && { publishedAtMs }),
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
				title: (playlist) => playlist.title,
				description: (playlist) => playlist.description,
				publishedAt: (playlist) => playlist.publishedAt,
				publishedAtMs: (playlist) => playlist.publishedAtMs,
				$channel: (playlist) => playlist.$channel,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeComment,
			resolve: {
				[YoutubeCommentSelector.VideoIdCommentId]: async ({ commentId, videoId: videoIdSelector }, context) => {
					const { getComment } = await import('$/sources/Youtube/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const d = (await getComment(publicEnv, commentId))
						.items?.[0]
					if (d == null) throw new Error('Youtube_Rest: comment not found')
					const snippet = d.snippet
					const videoId = optionalNonemptyString(snippet?.videoId) ?? videoIdSelector
					const parentId = optionalNonemptyString(snippet?.parentId)
					const authorChannelId = (
						typeof snippet?.authorChannelId === 'string' ?
							optionalNonemptyString(snippet.authorChannelId)
						:
							optionalNonemptyString(snippet?.authorChannelId?.value)
					)
					const authorDisplayName = optionalNonemptyString(snippet?.authorDisplayName)
					const publishedAt = optionalNonemptyString(snippet?.publishedAt)
					const publishedAtMs = optionalTimestampMs(snippet?.publishedAt)
					return {
						text: optionalNonemptyString(snippet?.textDisplay) ?? optionalNonemptyString(snippet?.textOriginal),
						...(authorDisplayName != null && { authorDisplayName }),
						...(authorChannelId != null && {
							$author: {
								[EntityMetaKey.Selector]: { channelId: authorChannelId },
							},
						}),
						...(publishedAt != null && { publishedAt }),
						...(publishedAtMs != null && { publishedAtMs }),
						$video: {
							[EntityMetaKey.Selector]: { videoId },
						},
						$parentComment: (
							parentId == null ?
								undefined
							:
								{
									[EntityMetaKey.Selector]: {
										videoId,
										commentId: parentId,
									},
								}
						),
					}
				}
			},
		})({
				text: (comment) => comment.text,
				authorDisplayName: (comment) => comment.authorDisplayName,
				$author: (comment) => comment.$author,
				publishedAt: (comment) => comment.publishedAt,
				publishedAtMs: (comment) => comment.publishedAtMs,
				$video: (comment) => comment.$video,
				$parentComment: (comment) => comment.$parentComment,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeChannel_Timestamp,
			resolve: {
				[YoutubeChannel_TimestampSelector.YoutubeChannelTimestampMs]: async ({ $channel }, context) => {
					const { getChannel } = await import('$/sources/Youtube/Rest/queries.ts')
					const channel = (await getChannel(context.publicEnv, $channel.channelId))
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
				subscriberCount: (timestamp) => timestamp.subscriberCount,
				videoCount: (timestamp) => timestamp.videoCount,
				viewCount: (timestamp) => timestamp.viewCount,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeVideo_Timestamp,
			resolve: {
				[YoutubeVideo_TimestampSelector.YoutubeVideoTimestampMs]: async ({ $video }, context) => {
					const { getVideo } = await import('$/sources/Youtube/Rest/queries.ts')
					const video = (await getVideo(context.publicEnv, $video.videoId))
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
				viewCount: (timestamp) => timestamp.viewCount,
				likeCount: (timestamp) => timestamp.likeCount,
				commentCount: (timestamp) => timestamp.commentCount,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeComment_Timestamp,
			resolve: {
				[YoutubeComment_TimestampSelector.YoutubeCommentTimestampMs]: async ({ $comment }, context) => {
					const {
						getComment,
						getCommentThread,
					} = await import('$/sources/Youtube/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const comment = (await getComment(publicEnv, $comment.commentId))
						.items?.[0]
					if (comment == null) throw new Error('Youtube_Rest: comment not found')
					const thread = (
						optionalNonemptyString(comment.snippet?.parentId) == null ?
							(await getCommentThread(publicEnv, $comment.commentId))
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
				likeCount: (timestamp) => timestamp.likeCount,
				replyCount: (timestamp) => timestamp.replyCount,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubePlaylist_Timestamp,
			resolve: {
				[YoutubePlaylist_TimestampSelector.YoutubePlaylistTimestampMs]: async ({ $playlist }, context) => {
					const { getPlaylist } = await import('$/sources/Youtube/Rest/queries.ts')
					const playlist = (await getPlaylist(context.publicEnv, $playlist.playlistId))
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
				itemCount: (timestamp) => timestamp.itemCount,
			}),
		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeChannel,
			resolve: {
				[YoutubeChannelSelector.ChannelId]: async (entitySelector, context) => {
					const { getChannel } = await import('$/sources/Youtube/Rest/queries.ts')
					const channel = (await getChannel(context.publicEnv, entitySelector.channelId))
						.items?.[0]
					if (channel == null) throw new Error('Youtube_Rest: channel not found')
					return [
						{
							[EntityMetaKey.Selector]: {
								$channel: entitySelector,
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
				$$timestamps: (channel) => channel,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeChannel,
			resolve: {
				[YoutubeChannelSelector.ChannelId]: async ({ channelId }, context) => {
					const { searchChannelVideos } = await import('$/sources/Youtube/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						((await searchChannelVideos(publicEnv, channelId, limit)).items ?? [])
							.flatMap((video) => (
							video.id?.videoId == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: { videoId: video.id.videoId },
								}]
							))
					)
				}
			},
		})({
				$$videos: (channel) => channel,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeChannel,
			resolve: {
				[YoutubeChannelSelector.ChannelId]: async ({ channelId }, context) => {
					const { getChannel } = await import('$/sources/Youtube/Rest/queries.ts')
					const channel = (await getChannel(context.publicEnv, channelId))
						.items?.[0]
					if (channel == null) throw new Error('Youtube_Rest: channel not found')
					const count = Number(channel.statistics?.videoCount)
					if (!Number.isInteger(count) || count < 0)
						throw new Error('Youtube_Rest: channel video count not found')
					return count
				}
			},
		})({
				$$videos: {
					resolveCount: (count) => count,
				},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeChannel,
			resolve: {
				[YoutubeChannelSelector.ChannelId]: async ({ channelId }, context) => {
					const { listChannelPlaylists } = await import('$/sources/Youtube/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						((await listChannelPlaylists(publicEnv, channelId, limit)).items ?? [])
							.flatMap((video) => (
							video.id == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: { playlistId: video.id },
								}]
							))
					)
				}
			},
		})({
				$$playlists: (channel) => channel,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubePlaylist,
			resolve: {
				[YoutubePlaylistSelector.PlaylistId]: async (entitySelector, context) => {
					const { getPlaylist } = await import('$/sources/Youtube/Rest/queries.ts')
					const playlist = (await getPlaylist(context.publicEnv, entitySelector.playlistId))
						.items?.[0]
					if (playlist == null) throw new Error('Youtube_Rest: playlist not found')
					return [
						{
							[EntityMetaKey.Selector]: {
								$playlist: entitySelector,
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
				$$timestamps: (playlist) => playlist,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubePlaylist,
			resolve: {
				[YoutubePlaylistSelector.PlaylistId]: async ({ playlistId }, context) => {
					const { listPlaylistItems } = await import('$/sources/Youtube/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						((await listPlaylistItems(publicEnv, playlistId, limit)).items ?? [])
							.flatMap((video) => (
							((videoId) => (
								videoId == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: { videoId },
									}]
							))(
								optionalNonemptyString(video.contentDetails?.videoId)
								?? optionalNonemptyString(video.snippet?.resourceId?.videoId)
							)
							))
					)
				}
			},
		})({
				$$videos: (playlist) => playlist,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubePlaylist,
			resolve: {
				[YoutubePlaylistSelector.PlaylistId]: async ({ playlistId }, context) => {
					const { getPlaylist } = await import('$/sources/Youtube/Rest/queries.ts')
					const playlist = (await getPlaylist(context.publicEnv, playlistId))
						.items?.[0]
					if (playlist == null) throw new Error('Youtube_Rest: playlist not found')
					if (playlist.contentDetails?.itemCount == null || playlist.contentDetails.itemCount < 0)
							throw new Error('Youtube_Rest: playlist item count not found')
					return playlist.contentDetails.itemCount
				}
			},
		})({
				$$videos: {
					resolveCount: (count) => count,
				},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeVideo,
			resolve: {
				[YoutubeVideoSelector.VideoId]: async (entitySelector, context) => {
					const { getVideo } = await import('$/sources/Youtube/Rest/queries.ts')
					const video = (await getVideo(context.publicEnv, entitySelector.videoId))
						.items?.[0]
					if (video == null) throw new Error('Youtube_Rest: video not found')
					return [
						{
							[EntityMetaKey.Selector]: {
								$video: entitySelector,
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
				$$timestamps: (video) => video,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeVideo,
			resolve: {
				[YoutubeVideoSelector.VideoId]: async ({ videoId }, context) => {
					const { listCommentThreads } = await import('$/sources/Youtube/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					const refs: {
						[EntityMetaKey.Selector]: {
							videoId: string
							commentId: string
						}
						publishedAtMs?: number
					}[] = []
					let pageToken: string | undefined
					while (refs.length < limit) {
						const page = await listCommentThreads(
							publicEnv,
							videoId,
							limit - refs.length,
							pageToken
					)
						for (const thread of page.items ?? []) {
							const commentId = optionalNonemptyString(thread.snippet?.topLevelComment?.id)
							if (commentId == null) continue
							const publishedAtMs = optionalTimestampMs(
								thread.snippet?.topLevelComment?.snippet?.publishedAt
						)
							refs.push({
								[EntityMetaKey.Selector]: {
									videoId: videoId,
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
				$$comments: (video) => video,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeVideo,
			resolve: {
				[YoutubeVideoSelector.VideoId]: async ({ videoId }, context) => {
					const { getVideo } = await import('$/sources/Youtube/Rest/queries.ts')
					const video = (await getVideo(context.publicEnv, videoId))
						.items?.[0]
					if (video == null) throw new Error('Youtube_Rest: video not found')
					const count = Number(video.statistics?.commentCount)
					if (!Number.isInteger(count) || count < 0)
						throw new Error('Youtube_Rest: video comment count not found')
					return count
				}
			},
		})({
				$$comments: {
					resolveCount: (count) => count,
				},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeComment,
			resolve: {
				[YoutubeCommentSelector.VideoIdCommentId]: async (entitySelector, context) => {
					const {
						getComment,
						getCommentThread,
					} = await import('$/sources/Youtube/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const comment = (await getComment(publicEnv, entitySelector.commentId))
						.items?.[0]
					if (comment == null) throw new Error('Youtube_Rest: comment not found')
					const thread = (
						optionalNonemptyString(comment.snippet?.parentId) == null ?
							(await getCommentThread(publicEnv, entitySelector.commentId))
								.items?.[0]
						:
							undefined
					)
					const replyCount = thread?.snippet?.totalReplyCount
					return [
						{
							[EntityMetaKey.Selector]: {
								$comment: entitySelector,
								timestampMs: Date.now(),
							},
							...(comment.snippet?.likeCount != null && { likeCount: comment.snippet.likeCount }),
							...(replyCount != null && { replyCount }),
						},
					]
				}
			},
		})({
				$$timestamps: (comment) => comment,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeComment,
			resolve: {
				[YoutubeCommentSelector.VideoIdCommentId]: async ({ commentId: commentIdSelector, videoId }, context) => {
					const {
						getComment,
						listCommentReplies,
					} = await import('$/sources/Youtube/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const parent = (await getComment(publicEnv, commentIdSelector))
						.items?.[0]
					if (parent?.snippet?.parentId != null && parent.snippet.parentId !== '') return []
					const limit = resolverContextRowLimit(context)
					const refs: {
						[EntityMetaKey.Selector]: {
							videoId: string
							commentId: string
						}
						publishedAtMs?: number
					}[] = []
					let pageToken: string | undefined
					while (refs.length < limit) {
						const page = await listCommentReplies(
							publicEnv,
							commentIdSelector,
							limit - refs.length,
							pageToken
					)
						for (const video of page.items ?? []) {
							const commentId = optionalNonemptyString(video.id)
							if (commentId == null) continue
							const publishedAtMs = optionalTimestampMs(video.snippet?.publishedAt)
							refs.push({
								[EntityMetaKey.Selector]: {
									videoId: videoId,
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
				$$replies: (comment) => comment,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType.YoutubeComment,
			resolve: {
				[YoutubeCommentSelector.VideoIdCommentId]: async ({ commentId }, context) => {
					const {
						getComment,
						getCommentThread,
					} = await import('$/sources/Youtube/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const comment = (await getComment(publicEnv, commentId))
						.items?.[0]
					if (comment == null) throw new Error('Youtube_Rest: comment not found')
					if (optionalNonemptyString(comment.snippet?.parentId) != null) return 0
					const thread = (await getCommentThread(publicEnv, commentId))
						.items?.[0]
					if (thread?.snippet?.totalReplyCount == null || thread.snippet.totalReplyCount < 0)
						throw new Error('Youtube_Rest: comment reply count not found')
					return thread.snippet.totalReplyCount
				}
			},
		})({
				$$replies: {
					resolveCount: (count) => count,
				},
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType._GlobalYoutubeNetwork,
			resolve: {
				[_GlobalYoutubeNetworkSelector.Scope]: async (_entitySelector, context) => {
					const { listPopularVideos } = await import('$/sources/Youtube/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						((await listPopularVideos(publicEnv, limit)).items ?? [])
							.flatMap((video) => {
								const channelId = optionalNonemptyString(video.snippet?.channelId)
								if (channelId == null) return []
								return [{
									[EntityMetaKey.Selector]: { channelId },
								}]
							})
					)
				}
			},
		})({
				$$observedChannels: (network) => network,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType._GlobalYoutubeNetwork,
			resolve: {
				[_GlobalYoutubeNetworkSelector.Scope]: async (_entitySelector, context) => {
					const { listPopularVideos } = await import('$/sources/Youtube/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						((await listPopularVideos(publicEnv, limit)).items ?? [])
							.flatMap((video) => (
								video.id == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: { videoId: video.id },
									}]
							))
					)
				}
			},
		})({
				$$observedVideos: (network) => network,
			}),

		defineResolver(Source.Youtube_Rest, {
			entityType: EntityType._GlobalYoutubeNetwork,
			resolve: {
				[_GlobalYoutubeNetworkSelector.Scope]: async (_entitySelector, context) => {
					const {
						listChannelPlaylists,
						listPopularVideos,
					} = await import('$/sources/Youtube/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					const channelIds: string[] = [
						...youtubeNetworkSeedChannels.map(({ channelId }) => channelId),
					]
					for (const video of ((await listPopularVideos(publicEnv, limit)).items ?? [])) {
						const channelId = optionalNonemptyString(video.snippet?.channelId)
						if (channelId != null) channelIds.push(channelId)
					}
					const refs: { [EntityMetaKey.Selector]: { playlistId: string } }[] = []
					for (const channelId of channelIds) {
						for (const playlist of ((await listChannelPlaylists(publicEnv, channelId, limit)).items ?? [])) {
							const playlistId = optionalNonemptyString(playlist.id)
							if (playlistId == null) continue
							refs.push({
								[EntityMetaKey.Selector]: { playlistId },
							})
							if (refs.length >= limit) break
						}
						if (refs.length >= limit) break
					}
					return refs.slice(0, limit)
				}
			},
		})({
				$$observedPlaylists: (network) => network,
			}),
	],
}
