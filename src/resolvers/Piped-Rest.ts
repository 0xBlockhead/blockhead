import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { YoutubeLiveBroadcastContent } from '$/schema/YoutubeLiveBroadcastContent.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'
import { Source } from '$/sources/Source.ts'
import type {
	PipedComment,
	PipedPlaylistSummary,
	PipedStreamItem,
} from '$/sources/Piped/Rest/types.ts'
import {
	getChannelIdFromUploaderUrl,
	getPlaylistIdFromUrl,
	getVideoIdFromUrl,
} from '$/sources/Piped/Rest/queries.ts'

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

const pipedUrlValue = (value: string | undefined) => {
	const url = optionalNonemptyString(value)
	if (url == null) return undefined
	const parsed = UrlString(url)
	return parsed instanceof type.errors ? undefined : parsed
}

const pipedChannelReference = (
	channelId: string,
	title: string | undefined,
	avatarUrl: string | undefined
) => ({
	[EntityMetaKey.Selector]: { channelId },
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.YoutubeChannel, [], 'title')]: optionalNonemptyString(title),
		[entityFieldAddressKey(EntityType.YoutubeChannel, [], '$icon')]: mediaFromUrl(optionalNonemptyString(avatarUrl), MediaType.Image),
	},
})

const pipedVideoReference = (
	videoId: string,
	video: PipedStreamItem
) => {
	const channelId = getChannelIdFromUploaderUrl(video.uploaderUrl)
	return {
		[EntityMetaKey.Selector]: { videoId },
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'title')]: optionalNonemptyString(video.title),
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'publishedAt')]: optionalNonemptyString(video.uploadedDate),
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'publishedAtMs')]: optionalTimestampMs(video.uploadedDate),
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'thumbnailUrl')]: pipedUrlValue(video.thumbnail),
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], '$thumbnail')]: mediaFromUrl(optionalNonemptyString(video.thumbnail), MediaType.Image),
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'durationSeconds')]: video.duration,
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], '$author')]: (
				channelId == null ?
					undefined
				:
					{
						[EntityMetaKey.Selector]: { channelId },
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.YoutubeChannel, [], 'title')]: optionalNonemptyString(video.uploaderName),
							[entityFieldAddressKey(EntityType.YoutubeChannel, [], '$icon')]: mediaFromUrl(optionalNonemptyString(video.uploaderAvatar), MediaType.Image),
						},
					}
			),
		},
	}
}

const pipedPlaylistReference = (
	playlistId: string,
	playlist: PipedPlaylistSummary
) => {
	const channelId = getChannelIdFromUploaderUrl(playlist.uploaderUrl)
	return {
		[EntityMetaKey.Selector]: { playlistId },
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.YoutubePlaylist, [], 'title')]: optionalNonemptyString(playlist.name),
			[entityFieldAddressKey(EntityType.YoutubePlaylist, [], 'description')]: pipedPlainText(playlist.description),
			[entityFieldAddressKey(EntityType.YoutubePlaylist, [], '$thumbnail')]: mediaFromUrl(optionalNonemptyString(playlist.thumbnail), MediaType.Image),
			[entityFieldAddressKey(EntityType.YoutubePlaylist, [], '$channel')]: (
				channelId == null ?
					undefined
				:
					pipedChannelReference(channelId, playlist.uploaderName, undefined)
			),
		},
	}
}

const pipedCommentReference = (
	videoId: string,
	commentId: string,
	comment: PipedComment
) => {
	const authorChannelId = getChannelIdFromUploaderUrl(comment.commentorUrl)
	return {
		[EntityMetaKey.Selector]: {
			videoId,
			commentId,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.YoutubeComment, [], 'text')]: pipedPlainText(comment.commentText),
			[entityFieldAddressKey(EntityType.YoutubeComment, [], 'authorDisplayName')]: optionalNonemptyString(comment.author),
			[entityFieldAddressKey(EntityType.YoutubeComment, [], 'publishedAt')]: optionalNonemptyString(comment.commentedTime),
			[entityFieldAddressKey(EntityType.YoutubeComment, [], 'publishedAtMs')]: optionalTimestampMs(comment.commentedTime),
			[entityFieldAddressKey(EntityType.YoutubeComment, [], '$author')]: (
				authorChannelId == null ?
					undefined
				:
					pipedChannelReference(authorChannelId, comment.author, comment.thumbnail)
			),
			[entityFieldAddressKey(EntityType.YoutubeComment, [], '$video')]: {
				[EntityMetaKey.Selector]: { videoId },
			},
		},
	}
}

export default {
	source: Source.Piped_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.YoutubeChannel,
			resolve: {
				ChannelId: {
					resolve: async ({ channelId }) => {
						const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
						const d = await getChannel(channelId)
						const iconMedia = mediaFromUrl(optionalNonemptyString(d.avatarUrl), MediaType.Image)
						return {
							title: optionalNonemptyString(d.name),
							description: pipedPlainText(d.description),
							...(iconMedia != null && {
								$icon: iconMedia,
							}),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$channel: { channelId },
									timestampMs: Date.now(),
									source: Source.Piped_Rest,
								},
								...(d.subscriberCount != null && {
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.YoutubeChannel_Timestamp, [], 'subscriberCount')]:
											d.subscriberCount,
									},
								}),
							}],
						}
					},
				}
			},
		})({
				title: (channel) => channel.title,
				description: (channel) => channel.description,
				$icon: (channel) => channel.$icon,
				$$timestamps: (channel) => channel.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.YoutubePlaylist,
			resolve: {
				PlaylistId: {
					resolve: async ({ playlistId }) => {
						const { getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
						const d = await getPlaylist(playlistId)
						if (optionalNonemptyString(d.name) == null) throw new Error('Piped_Rest: playlist not found')
						const channelId = getChannelIdFromUploaderUrl(d.uploaderUrl)
						const thumbnailMedia = mediaFromUrl(optionalNonemptyString(d.thumbnailUrl), MediaType.Image)
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
							...(thumbnailMedia != null && { $thumbnail: thumbnailMedia }),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$playlist: { playlistId },
									timestampMs: Date.now(),
									source: Source.Piped_Rest,
								},
								...(d.videos != null && {
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.YoutubePlaylist_Timestamp, [], 'itemCount')]:
											d.videos,
									},
								}),
							}],
						}
					},
				}
			},
		})({
				title: (playlist) => playlist.title,
				$channel: (playlist) => playlist.$channel,
				$thumbnail: (playlist) => playlist.$thumbnail,
				$$timestamps: (playlist) => playlist.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.YoutubeVideo,
			resolve: {
				VideoId: {
					resolve: async ({ videoId }) => {
						const { getStream } = await import('$/sources/Piped/Rest/queries.ts')
						const d = await getStream(videoId)
						const title = optionalNonemptyString(d.title)
						if (title == null) throw new Error('Piped_Rest: video not found')
						const channelId = getChannelIdFromUploaderUrl(d.uploaderUrl)
						const publishedAt = optionalNonemptyString(d.uploadDate)
						const publishedAtMs = optionalTimestampMs(d.uploadDate)
						const thumbnailUrl = optionalNonemptyString(d.thumbnailUrl)
						const thumbnailMedia = mediaFromUrl(thumbnailUrl, MediaType.Image)
						const liveBroadcastContent = (
							d.livestream === true ?
								YoutubeLiveBroadcastContent.Live
							: d.livestream === false ?
								YoutubeLiveBroadcastContent.None
							:
								undefined
						)
						return {
							title,
							description: pipedPlainText(d.description),
							...(publishedAt != null && { publishedAt }),
							...(publishedAtMs != null && { publishedAtMs }),
							...(d.duration != null && { durationSeconds: d.duration }),
							...(liveBroadcastContent != null && { liveBroadcastContent }),
							...(thumbnailUrl != null && {
								thumbnailUrl,
							}),
							...(thumbnailMedia != null && { $thumbnail: thumbnailMedia }),
							$author: (
								channelId == null ?
									undefined
								:
									{
										[EntityMetaKey.Selector]: { channelId },
									}
							),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$video: { videoId },
									timestampMs: Date.now(),
									source: Source.Piped_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(d.views != null && {
										[entityFieldAddressKey(EntityType.YoutubeVideo_Timestamp, [], 'viewCount')]:
											d.views,
									}),
									...(d.likes != null && {
										[entityFieldAddressKey(EntityType.YoutubeVideo_Timestamp, [], 'likeCount')]:
											d.likes,
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
				durationSeconds: (video) => video.durationSeconds,
				liveBroadcastContent: (video) => video.liveBroadcastContent,
				thumbnailUrl: (video) => video.thumbnailUrl,
				$thumbnail: (video) => video.$thumbnail,
				$author: (video) => video.$author,
				$$timestamps: (video) => video.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.YoutubeComment,
			resolve: {
				VideoIdCommentId: {
					resolve: async ({ commentId, videoId }, context) => {
						const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const page = await listComments(videoId, limit)
						if (page.disabled === true)
							throw new Error(`Piped_Rest: comments disabled for video ${videoId}`)
							const comment = page.comments.find((comment) => (
							comment.commentId === commentId
						))
						if (comment == null) throw new Error('Piped_Rest: comment not found')
						const publishedAt = optionalNonemptyString(comment.commentedTime)
						const publishedAtMs = optionalTimestampMs(comment.commentedTime)
						const authorChannelId = getChannelIdFromUploaderUrl(comment.commentorUrl)
						return {
							text: pipedPlainText(comment.commentText),
							authorDisplayName: optionalNonemptyString(comment.author),
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
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$comment: {
										videoId,
										commentId,
									},
									timestampMs: Date.now(),
									source: Source.Piped_Rest,
								},
								...(comment.likeCount != null && {
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.YoutubeComment_Timestamp, [], 'likeCount')]:
											comment.likeCount,
									},
								}),
							}],
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
				$$timestamps: (comment) => comment.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.YoutubeChannel,
			resolve: {
					ChannelId: {
						resolve: async ({ channelId }, context) => {
							const { listChannelVideos } = await import('$/sources/Piped/Rest/queries.ts')
							return listChannelVideos(
								channelId,
								resolverContextRowLimit(context),
								{
									nextpage: context.providerContinuationToken,
								}
							)
						},
					}
				},
			})({
				$$videos: {
					select: (page) => (
						page.items.flatMap((video) => (
							((videoId) => (
								videoId == null ?
									[]
								:
									[pipedVideoReference(videoId, video)]
							))(getVideoIdFromUrl(video.url))
						))
					),
					continuation: (page, { channelId }) => (
						page.nextpage == null || page.nextpage === '' ?
							{
								operation: 'channel:videos',
								target: channelId,
								terminal: true,
							}
						:
							{
								operation: 'channel:videos',
								target: channelId,
								terminal: false,
								token: page.nextpage,
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType.YoutubeChannel,
			resolve: {
					ChannelId: {
						resolve: async ({ channelId }, context) => {
							const {
								listChannelPlaylists,
							} = await import('$/sources/Piped/Rest/queries.ts')
							return listChannelPlaylists(
								channelId,
								resolverContextRowLimit(context),
								{
									nextpage: context.providerContinuationToken,
								}
							)
						},
					}
				},
			})({
				$$playlists: {
					select: (page) => (
						page.items.flatMap((playlist) => (
							((playlistId) => (
								playlistId == null ?
									[]
								:
									[pipedPlaylistReference(playlistId, playlist)]
							))(getPlaylistIdFromUrl(playlist.url))
						))
					),
					continuation: (page, { channelId }) => (
						page.nextpage == null || page.nextpage === '' ?
							{
								operation: 'channel:playlists',
								target: channelId,
								terminal: true,
							}
						:
							{
								operation: 'channel:playlists',
								target: channelId,
								terminal: false,
								token: page.nextpage,
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType.YoutubePlaylist,
			resolve: {
					PlaylistId: {
						resolve: async ({ playlistId }, context) => {
							const { listPlaylistVideos } = await import('$/sources/Piped/Rest/queries.ts')
							return listPlaylistVideos(
								playlistId,
								resolverContextRowLimit(context),
								{
									nextpage: context.providerContinuationToken,
								}
							)
						},
					}
				},
			})({
				$$videos: {
					select: (page) => (
						page.items.flatMap((video) => (
							((videoId) => (
								videoId == null ?
									[]
								:
									[pipedVideoReference(videoId, video)]
							))(getVideoIdFromUrl(video.url))
						))
					),
					continuation: (page, { playlistId }) => (
						page.nextpage == null || page.nextpage === '' ?
							{
								operation: 'playlist:videos',
								target: playlistId,
								terminal: true,
							}
						:
							{
								operation: 'playlist:videos',
								target: playlistId,
								terminal: false,
								token: page.nextpage,
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType.YoutubeVideo,
			resolve: {
					VideoId: {
						resolve: async ({ videoId }, context) => {
							const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
							const page = await listComments(
								videoId,
								resolverContextRowLimit(context),
								{
									nextpage: context.providerContinuationToken,
								}
							)
							if (page.disabled === true)
								throw new Error(`Piped_Rest: comments disabled for video ${videoId}`)
							return page
						},
					}
				},
			})({
				$$comments: {
					select: (page, { videoId }) => (
							page.comments.flatMap((comment) => {
							const commentId = optionalNonemptyString(comment.commentId)
							return commentId == null ?
								[]
							:
								[pipedCommentReference(videoId, commentId, comment)]
						})
					),
					continuation: (page, { videoId }) => (
						page.nextpage == null || page.nextpage === '' ?
							{
								operation: 'comments',
								target: videoId,
								terminal: true,
							}
						:
							{
								operation: 'comments',
								target: videoId,
								terminal: false,
								token: page.nextpage,
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType._GlobalYoutubeNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { listTrending } = await import('$/sources/Piped/Rest/queries.ts')
						return listTrending(
							resolverContextRowLimit(context)
						)
					},
				}
			},
		})({
			$$observedChannels: (videos) => (
				videos.flatMap((video) => {
					const channelId = getChannelIdFromUploaderUrl(video.uploaderUrl)
					return channelId == null ?
						[]
					:
						[pipedChannelReference(channelId, video.uploaderName, video.uploaderAvatar)]
				})
			),
			$$observedVideos: (videos) => (
				videos.flatMap((video) => (
					((videoId) => (
						videoId == null ?
							[]
						:
							[pipedVideoReference(videoId, video)]
					))(getVideoIdFromUrl(video.url))
				))
			),
		}),

		defineResolver({
			entityType: EntityType._GlobalYoutubeNetwork,
			resolve: {
				Scope: {
					resolve: async ({ scope }, context) => {
						const { listTrending } = await import('$/sources/Piped/Rest/queries.ts')
						try {
							const videos = await listTrending(
								resolverContextRowLimit(context)
							)
							const channelIds = new Set(
								videos.flatMap((video) => {
									const channelId = getChannelIdFromUploaderUrl(video.uploaderUrl)
									return channelId == null ? [] : [channelId]
								})
							)
							const videoIds = new Set(
								videos.flatMap((video) => {
									const videoId = getVideoIdFromUrl(video.url)
									return videoId == null ? [] : [videoId]
								})
							)
							return [{
								[EntityMetaKey.Selector]: {
									$hub: { scope },
									timestampMs: Date.now(),
									source: Source.Piped_Rest,
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
									timestampMs: Date.now(),
									source: Source.Piped_Rest,
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
	],
} satisfies RegisteredSourceResolverModule
