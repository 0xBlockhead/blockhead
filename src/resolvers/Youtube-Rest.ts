import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { type } from 'arktype'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { YoutubeLiveBroadcastContent } from '$/schema/YoutubeLiveBroadcastContent.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import type {
	YoutubeApiChannel,
	YoutubeApiComment,
	YoutubeApiCommentThread,
	YoutubeApiPlaylist,
	YoutubeApiSnippet,
	YoutubeApiVideo,
} from '$/sources/Youtube/Rest/types.ts'


const youtubeThumbnailUrl = (thumbnails: YoutubeApiSnippet['thumbnails']) => (
	optionalNonemptyString(
		thumbnails?.maxres?.url
		?? thumbnails?.standard?.url
		?? thumbnails?.high?.url
		?? thumbnails?.medium?.url
		?? thumbnails?.default?.url
	)
)

const youtubeThumbnailUrlValue = (snippet: YoutubeApiSnippet | undefined) => {
	const thumbnailUrl = youtubeThumbnailUrl(snippet?.thumbnails)
	if (thumbnailUrl == null) return undefined
	const parsed = UrlString(thumbnailUrl)
	return parsed instanceof type.errors ? undefined : parsed
}

const youtubeChannelReference = (
	channelId: string,
	snippet: YoutubeApiSnippet | undefined
) => ({
	[EntityMetaKey.Selector]: { channelId },
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.YoutubeChannel, [], 'title')]: optionalNonemptyString(snippet?.channelTitle) ?? optionalNonemptyString(snippet?.title),
	},
})

const youtubeVideoReference = (
	videoId: string,
	snippet: YoutubeApiSnippet | undefined
) => {
	const channelId = optionalNonemptyString(snippet?.channelId)
	return {
		[EntityMetaKey.Selector]: { videoId },
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'title')]: optionalNonemptyString(snippet?.title),
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'description')]: optionalNonemptyString(snippet?.description),
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'publishedAt')]: optionalNonemptyString(snippet?.publishedAt),
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'publishedAtMs')]: optionalTimestampMs(snippet?.publishedAt),
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'thumbnailUrl')]: youtubeThumbnailUrlValue(snippet),
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], '$thumbnail')]: mediaFromUrl(youtubeThumbnailUrl(snippet?.thumbnails), MediaType.Image),
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], '$author')]: (
				channelId == null ?
					undefined
				:
					youtubeChannelReference(channelId, snippet)
			),
		},
	}
}

const youtubePlaylistReference = (
	playlistId: string,
	snippet: YoutubeApiSnippet | undefined
) => {
	const channelId = optionalNonemptyString(snippet?.channelId)
	return {
		[EntityMetaKey.Selector]: { playlistId },
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.YoutubePlaylist, [], 'title')]: optionalNonemptyString(snippet?.title),
			[entityFieldAddressKey(EntityType.YoutubePlaylist, [], 'description')]: optionalNonemptyString(snippet?.description),
			[entityFieldAddressKey(EntityType.YoutubePlaylist, [], 'publishedAt')]: optionalNonemptyString(snippet?.publishedAt),
			[entityFieldAddressKey(EntityType.YoutubePlaylist, [], 'publishedAtMs')]: optionalTimestampMs(snippet?.publishedAt),
			[entityFieldAddressKey(EntityType.YoutubePlaylist, [], '$thumbnail')]: mediaFromUrl(youtubeThumbnailUrl(snippet?.thumbnails), MediaType.Image),
			[entityFieldAddressKey(EntityType.YoutubePlaylist, [], '$channel')]: (
				channelId == null ?
					undefined
				:
					youtubeChannelReference(channelId, snippet)
			),
		},
	}
}

const youtubeCommentReference = (
	videoId: string,
	commentId: string,
	comment: YoutubeApiComment
) => {
	const authorChannelId = optionalNonemptyString(comment.snippet?.authorChannelId?.value)
	const parentCommentId = optionalNonemptyString(comment.snippet?.parentId)

	return {
		[EntityMetaKey.Selector]: {
			videoId,
			commentId,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.YoutubeComment, [], 'text')]: optionalNonemptyString(comment.snippet?.textOriginal) ?? optionalNonemptyString(comment.snippet?.textDisplay),
			[entityFieldAddressKey(EntityType.YoutubeComment, [], 'authorDisplayName')]: optionalNonemptyString(comment.snippet?.authorDisplayName),
			[entityFieldAddressKey(EntityType.YoutubeComment, [], 'publishedAt')]: optionalNonemptyString(comment.snippet?.publishedAt),
			[entityFieldAddressKey(EntityType.YoutubeComment, [], 'publishedAtMs')]: optionalTimestampMs(comment.snippet?.publishedAt),
			[entityFieldAddressKey(EntityType.YoutubeComment, [], '$author')]: (
				authorChannelId == null ?
					undefined
				:
					{
						[EntityMetaKey.Selector]: { channelId: authorChannelId },
					}
			),
			[entityFieldAddressKey(EntityType.YoutubeComment, [], '$video')]: {
				[EntityMetaKey.Selector]: { videoId },
			},
			[entityFieldAddressKey(EntityType.YoutubeComment, [], '$parentComment')]: (
				parentCommentId == null ?
					undefined
				:
					{
						[EntityMetaKey.Selector]: {
							videoId,
							commentId: parentCommentId,
						},
					}
			),
		},
	}
}

export default {
	source: Source.Youtube_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.YoutubeChannel,
			resolve: {
				ChannelId: {
					resolve: async ({ channelId }, context) => {
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
							videoCount: d.statistics?.videoCount,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$channel: { channelId },
									timestampMs: Date.now(),
									source: Source.Youtube_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(d.statistics?.subscriberCount != null && {
										[entityFieldAddressKey(EntityType.YoutubeChannel_Timestamp, [], 'subscriberCount')]:
											Number(d.statistics.subscriberCount),
									}),
									...(d.statistics?.videoCount != null && {
										[entityFieldAddressKey(EntityType.YoutubeChannel_Timestamp, [], 'videoCount')]:
											Number(d.statistics.videoCount),
									}),
									...(d.statistics?.viewCount != null && {
										[entityFieldAddressKey(EntityType.YoutubeChannel_Timestamp, [], 'viewCount')]:
											Number(d.statistics.viewCount),
									}),
								},
							}],
						}
					},
				}
			},
		})({
				title: (channel) => channel.title,
				description: (channel) => channel.description,
				customUrl: (channel) => channel.customUrl,
				publishedAt: (channel) => channel.publishedAt,
				publishedAtMs: (channel) => channel.publishedAtMs,
				$icon: (channel) => channel.$icon,
				$$timestamps: (channel) => channel.$$timestamps,
				$$videos: {
					resolveCount: (channel) => {
						const count = Number(channel.videoCount)
						if (!Number.isInteger(count) || count < 0)
							throw new Error('Youtube_Rest: channel video count not found')
						return count
					},
				},
			}),

		defineResolver({
			entityType: EntityType.YoutubeVideo,
			resolve: {
				VideoId: {
					resolve: async ({ videoId }, context) => {
						const { getVideo } = await import('$/sources/Youtube/Rest/queries.ts')
						const d = (await getVideo(context.publicEnv, videoId))
							.items?.[0]
						if (d == null) throw new Error('Youtube_Rest: video not found')
						const channelId = optionalNonemptyString(d.snippet?.channelId)
						const thumbnailUrl = youtubeThumbnailUrlValue(d.snippet)
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
						const thumbnailMedia = mediaFromUrl(
							youtubeThumbnailUrl(d.snippet?.thumbnails),
							MediaType.Image
						)
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
									youtubeChannelReference(channelId, d.snippet)
							),
							...(thumbnailUrl != null && { thumbnailUrl }),
							...(thumbnailMedia != null && { $thumbnail: thumbnailMedia }),
							commentCount: d.statistics?.commentCount,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$video: { videoId },
									timestampMs: Date.now(),
									source: Source.Youtube_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(d.statistics?.viewCount != null && {
										[entityFieldAddressKey(EntityType.YoutubeVideo_Timestamp, [], 'viewCount')]:
											Number(d.statistics.viewCount),
									}),
									...(d.statistics?.likeCount != null && {
										[entityFieldAddressKey(EntityType.YoutubeVideo_Timestamp, [], 'likeCount')]:
											Number(d.statistics.likeCount),
									}),
									...(d.statistics?.commentCount != null && {
										[entityFieldAddressKey(EntityType.YoutubeVideo_Timestamp, [], 'commentCount')]:
											Number(d.statistics.commentCount),
									}),
								},
							}],
						}
					},
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
				$thumbnail: (video) => video.$thumbnail,
				$$timestamps: (video) => video.$$timestamps,
				$$comments: {
					resolveCount: (video) => {
						const count = Number(video.commentCount)
						if (!Number.isInteger(count) || count < 0)
							throw new Error('Youtube_Rest: video comment count not found')
						return count
					},
				},
			}),

		defineResolver({
			entityType: EntityType.YoutubePlaylist,
			resolve: {
				PlaylistId: {
					resolve: async ({ playlistId }, context) => {
						const { getPlaylist } = await import('$/sources/Youtube/Rest/queries.ts')
						const d = (await getPlaylist(context.publicEnv, playlistId))
							.items?.[0]
						if (d == null) throw new Error('Youtube_Rest: playlist not found')
						const channelId = optionalNonemptyString(d.snippet?.channelId)
						const publishedAt = optionalNonemptyString(d.snippet?.publishedAt)
						const publishedAtMs = optionalTimestampMs(d.snippet?.publishedAt)
						const thumbnailMedia = mediaFromUrl(youtubeThumbnailUrl(d.snippet?.thumbnails), MediaType.Image)
						return {
							title: optionalNonemptyString(d.snippet?.title),
							description: optionalNonemptyString(d.snippet?.description),
							...(publishedAt != null && { publishedAt }),
							...(publishedAtMs != null && { publishedAtMs }),
							$channel: (
								channelId == null ?
									undefined
								:
									youtubeChannelReference(channelId, d.snippet)
							),
							...(thumbnailMedia != null && { $thumbnail: thumbnailMedia }),
							itemCount: d.contentDetails?.itemCount,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$playlist: { playlistId },
									timestampMs: Date.now(),
									source: Source.Youtube_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(d.contentDetails?.itemCount != null && {
										[entityFieldAddressKey(EntityType.YoutubePlaylist_Timestamp, [], 'itemCount')]:
											d.contentDetails.itemCount,
									}),
								},
							}],
						}
					},
				}
			},
		})({
				title: (playlist) => playlist.title,
				description: (playlist) => playlist.description,
				publishedAt: (playlist) => playlist.publishedAt,
				publishedAtMs: (playlist) => playlist.publishedAtMs,
				$channel: (playlist) => playlist.$channel,
				$thumbnail: (playlist) => playlist.$thumbnail,
				$$timestamps: (playlist) => playlist.$$timestamps,
				$$videos: {
					resolveCount: (playlist) => {
						if (playlist.itemCount == null || playlist.itemCount < 0)
							throw new Error('Youtube_Rest: playlist item count not found')
						return playlist.itemCount
					},
				},
			}),

		defineResolver({
			entityType: EntityType.YoutubeComment,
			resolve: {
				VideoIdCommentId: {
					resolve: async ({ commentId, videoId: videoIdSelector }, context) => {
						const { getComment } = await import('$/sources/Youtube/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const d = (await getComment(publicEnv, commentId))
							.items?.[0]
						if (d == null) throw new Error('Youtube_Rest: comment not found')
						const snippet = d.snippet
						const videoId = optionalNonemptyString(snippet?.videoId)
						if (videoId != null && videoId !== videoIdSelector)
							throw new Error('Youtube_Rest: comment does not belong to requested video')
						const parentId = optionalNonemptyString(snippet?.parentId)
						const authorChannelId = optionalNonemptyString(snippet?.authorChannelId?.value)
						const authorDisplayName = optionalNonemptyString(snippet?.authorDisplayName)
						const publishedAt = optionalNonemptyString(snippet?.publishedAt)
						const publishedAtMs = optionalTimestampMs(snippet?.publishedAt)
						return {
							text: optionalNonemptyString(snippet?.textOriginal) ?? optionalNonemptyString(snippet?.textDisplay),
							...(authorDisplayName != null && { authorDisplayName }),
							...(authorChannelId != null && {
								$author: {
									[EntityMetaKey.Selector]: { channelId: authorChannelId },
								},
							}),
							...(publishedAt != null && { publishedAt }),
							...(publishedAtMs != null && { publishedAtMs }),
							$video: {
								[EntityMetaKey.Selector]: { videoId: videoIdSelector },
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
					},
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

		defineResolver({
			entityType: EntityType.YoutubeChannel,
			resolve: {
					ChannelId: {
						resolve: async ({ channelId }, context) => {
							const { searchChannelVideos } = await import('$/sources/Youtube/Rest/queries.ts')
							return searchChannelVideos(
								context.publicEnv,
								channelId,
								resolverContextRowLimit(context),
								context.providerContinuationToken
							)
						},
					}
				},
			})({
				$$videos: {
					select: (page) => (
						(page.items ?? []).flatMap((video) => (
							video.id?.videoId == null ?
								[]
							:
								[youtubeVideoReference(video.id.videoId, video.snippet)]
						))
					),
					continuation: (page, { channelId }) => (
						page.nextPageToken == null || page.nextPageToken === '' ?
							{
								operation: 'search.list:channel-videos',
								target: channelId,
								terminal: true,
							}
						:
							{
								operation: 'search.list:channel-videos',
								target: channelId,
								terminal: false,
								token: page.nextPageToken,
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType.YoutubeChannel,
			resolve: {
					ChannelId: {
						resolve: async ({ channelId }, context) => {
							const { listChannelPlaylists } = await import('$/sources/Youtube/Rest/queries.ts')
							return listChannelPlaylists(
								context.publicEnv,
								channelId,
								resolverContextRowLimit(context),
								context.providerContinuationToken
							)
						},
					}
				},
			})({
				$$playlists: {
					select: (page) => (
						(page.items ?? []).flatMap((playlist) => (
							playlist.id == null ?
								[]
							:
								[youtubePlaylistReference(playlist.id, playlist.snippet)]
						))
					),
					continuation: (page, { channelId }) => (
						page.nextPageToken == null || page.nextPageToken === '' ?
							{
								operation: 'playlists.list:channel',
								target: channelId,
								terminal: true,
							}
						:
							{
								operation: 'playlists.list:channel',
								target: channelId,
								terminal: false,
								token: page.nextPageToken,
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType.YoutubePlaylist,
			resolve: {
					PlaylistId: {
						resolve: async ({ playlistId }, context) => {
							const { listPlaylistItems } = await import('$/sources/Youtube/Rest/queries.ts')
							return listPlaylistItems(
								context.publicEnv,
								playlistId,
								resolverContextRowLimit(context),
								context.providerContinuationToken
							)
						},
					}
				},
			})({
				$$videos: {
					select: (page) => (
						(page.items ?? []).flatMap((video) => (
							((videoId) => (
								videoId == null ?
									[]
								:
									[youtubeVideoReference(videoId, video.snippet)]
							))(
								optionalNonemptyString(video.contentDetails?.videoId)
								?? optionalNonemptyString(video.snippet?.resourceId?.videoId)
							)
						))
					),
					continuation: (page, { playlistId }) => (
						page.nextPageToken == null || page.nextPageToken === '' ?
							{
								operation: 'playlistItems.list',
								target: playlistId,
								terminal: true,
							}
						:
							{
								operation: 'playlistItems.list',
								target: playlistId,
								terminal: false,
								token: page.nextPageToken,
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType.YoutubeVideo,
			resolve: {
					VideoId: {
						resolve: async ({ videoId }, context) => {
							const { listCommentThreads } = await import('$/sources/Youtube/Rest/queries.ts')
							return listCommentThreads(
								context.publicEnv,
								videoId,
								resolverContextRowLimit(context),
								context.providerContinuationToken
							)
						},
					}
				},
			})({
				$$comments: {
					select: (page, { videoId }) => (
						(page.items ?? []).flatMap((thread) => {
							const comment = thread.snippet?.topLevelComment
							const commentId = optionalNonemptyString(comment?.id)
							return commentId == null ?
								[]
							:
								[youtubeCommentReference(videoId, commentId, comment ?? {})]
						})
					),
					continuation: (page, { videoId }) => (
						page.nextPageToken == null || page.nextPageToken === '' ?
							{
								operation: 'commentThreads.list',
								target: videoId,
								terminal: true,
							}
						:
							{
								operation: 'commentThreads.list',
								target: videoId,
								terminal: false,
								token: page.nextPageToken,
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType.YoutubeComment,
			resolve: {
				VideoIdCommentId: {
					resolve: async (entitySelector, context) => {
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
							return {
								replyCount: (
									optionalNonemptyString(comment.snippet?.parentId) != null ?
										0
									:
										replyCount
								),
								$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$comment: entitySelector,
									timestampMs: Date.now(),
								source: Source.Youtube_Rest,
							},
								[EntityMetaKey.Fields]: {
									...(comment.snippet?.likeCount != null && {
										[entityFieldAddressKey(EntityType.YoutubeComment_Timestamp, [], 'likeCount')]: comment.snippet.likeCount,
									}),
									...(replyCount != null && {
										[entityFieldAddressKey(EntityType.YoutubeComment_Timestamp, [], 'replyCount')]: replyCount,
										}),
									},
								}],
							}
					},
				}
			},
		})({
				$$timestamps: (comment) => comment.$$timestamps,
				$$replies: {
					resolveCount: (comment) => {
						if (comment.replyCount == null || comment.replyCount < 0)
							throw new Error('Youtube_Rest: comment reply count not found')
						return comment.replyCount
					},
				},
			}),

		defineResolver({
			entityType: EntityType.YoutubeComment,
			resolve: {
					VideoIdCommentId: {
						resolve: async ({ commentId: commentIdSelector, videoId }, context) => {
						const {
							getComment,
							listCompleteCommentReplies,
						} = await import('$/sources/Youtube/Rest/queries.ts')
							const publicEnv = context.publicEnv
							const parent = (await getComment(publicEnv, commentIdSelector))
								.items?.[0]
							if (parent == null) throw new Error('Youtube_Rest: comment not found')
							if (parent.snippet?.videoId !== videoId)
								throw new Error('Youtube_Rest: comment does not belong to requested video')
							return (
								parent.snippet.parentId != null && parent.snippet.parentId !== '' ?
									{
										items: [],
										nextPageToken: undefined,
									}
								:
									listCompleteCommentReplies(
										publicEnv,
										videoId,
										commentIdSelector,
										resolverContextRowLimit(context),
										context.providerContinuationToken
									)
							)
						},
					}
				},
			})({
					$$replies: {
						select: (page, { videoId }) => (
							page.items.flatMap((comment) => {
							const commentId = optionalNonemptyString(comment.id)
							return commentId == null ?
								[]
							:
								[youtubeCommentReference(videoId, commentId, comment)]
						})
					),
					continuation: (page, { commentId }) => (
						page.nextPageToken == null || page.nextPageToken === '' ?
							{
								operation: 'comments.list:replies',
								target: commentId,
								terminal: true,
							}
						:
							{
								operation: 'comments.list:replies',
								target: commentId,
								terminal: false,
								token: page.nextPageToken,
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType._GlobalYoutubeNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { listPopularVideos } = await import('$/sources/Youtube/Rest/queries.ts')
						return (
							await listPopularVideos(
								context.publicEnv,
								resolverContextRowLimit(context)
							)
						).items ?? []
					},
				}
			},
		})({
			$$observedChannels: (videos) => (
				videos.flatMap((video) => {
					const channelId = optionalNonemptyString(video.snippet?.channelId)
					if (channelId == null) return []
					return [youtubeChannelReference(channelId, video.snippet)]
				})
			),
			$$observedVideos: (videos) => (
				videos.flatMap((video) => (
					video.id == null ?
						[]
					:
						[youtubeVideoReference(video.id, video.snippet)]
				))
			),
		}),

		defineResolver({
			entityType: EntityType._GlobalYoutubeNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const {
							listChannelPlaylists,
							listPopularVideos,
						} = await import('$/sources/Youtube/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const limit = resolverContextRowLimit(context)
						const channelIds = new Set<string>()
						for (const video of ((await listPopularVideos(publicEnv, limit)).items ?? [])) {
							const channelId = optionalNonemptyString(video.snippet?.channelId)
							if (channelId != null) channelIds.add(channelId)
						}
						const refs: ReturnType<typeof youtubePlaylistReference>[] = []
						for (const channelId of channelIds) {
							for (const playlist of ((await listChannelPlaylists(publicEnv, channelId, limit)).items ?? [])) {
								const playlistId = optionalNonemptyString(playlist.id)
								if (playlistId == null) continue
								refs.push(youtubePlaylistReference(playlistId, playlist.snippet))
								if (refs.length >= limit) break
							}
							if (refs.length >= limit) break
						}
						return refs.slice(0, limit)
					},
				}
			},
		})({
				$$observedPlaylists: (network) => network,
			}),

		defineResolver({
			entityType: EntityType._GlobalYoutubeNetwork,
			resolve: {
				Scope: {
					resolve: async ({ scope }, context) => {
						const { listPopularVideos } = await import('$/sources/Youtube/Rest/queries.ts')
						const timestampMs = Date.now()
						try {
							const videos = (await listPopularVideos(
								context.publicEnv,
								resolverContextRowLimit(context)
							)).items ?? []
							const channelIds = new Set(
								videos.flatMap((video) => {
									const channelId = optionalNonemptyString(video.snippet?.channelId)
									return channelId == null ? [] : [channelId]
								})
							)
							const videoIds = new Set(
								videos.flatMap((video) => {
									const videoId = optionalNonemptyString(video.id)
									return videoId == null ? [] : [videoId]
								})
							)
							return [{
								[EntityMetaKey.Selector]: {
									$hub: { scope },
									timestampMs,
									source: Source.Youtube_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType._GlobalYoutubeNetwork_Timestamp, [], 'observedChannelCount')]:
										channelIds.size,
									[entityFieldAddressKey(EntityType._GlobalYoutubeNetwork_Timestamp, [], 'observedVideoCount')]:
										videoIds.size,
									[entityFieldAddressKey(EntityType._GlobalYoutubeNetwork_Timestamp, [], 'reachable')]:
										true,
								},
							}]
						} catch {
							return [{
								[EntityMetaKey.Selector]: {
									$hub: { scope },
									timestampMs,
									source: Source.Youtube_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType._GlobalYoutubeNetwork_Timestamp, [], 'reachable')]:
										false,
								},
							}]
						}
					},
				},
			},
		})({
			$$timestamps: (observations) => observations,
		}),

		defineResolver({
			entityType: EntityType._GlobalYoutubeNetwork_Timestamp,
			resolve: {
				HubTimestampMsSource: {
					resolve: async ({ $hub, timestampMs, source }) => {
						if (source !== Source.Youtube_Rest)
							throw new Error('Youtube_Rest: global YouTube observation source mismatch')

						return {
							$hub: {
								[EntityMetaKey.Selector]: $hub,
							},
							timestampMs,
							source,
						}
					},
				},
			},
		})({
			$hub: (observation) => observation.$hub,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
		}),
	],
} satisfies RegisteredSourceResolverModule
