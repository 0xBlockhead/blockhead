import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'
import { Source } from '$/sources/Source.ts'
import { YoutubeChannelSelector } from '$/schema/YoutubeChannel.ts'
import { YoutubeVideoSelector } from '$/schema/YoutubeVideo.ts'
import { YoutubePlaylistSelector } from '$/schema/YoutubePlaylist.ts'
import { YoutubeCommentSelector } from '$/schema/YoutubeComment.ts'
import { _GlobalYoutubeNetworkSelector } from '$/schema/_GlobalYoutubeNetwork.ts'
import type {
	PipedComment,
	PipedPlaylistSummary,
	PipedStreamItem,
} from '$/sources/Piped/Rest/types.ts'
import {
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
	const channelId = video.uploaderUrl?.match(/\/channel\/([^/?]+)/)?.[1]
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
	const channelId = playlist.uploaderUrl?.match(/\/channel\/([^/?]+)/)?.[1]
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
	const authorChannelId = comment.commentorUrl?.match(/\/channel\/([^/?]+)/)?.[1]
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
		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubeChannel,
			resolve: {
				[YoutubeChannelSelector.ChannelId]: {
					resolve: async ({ channelId }, context) => {
						const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
						const d = await getChannel(context.publicEnv, channelId)
						if (d.id == null) throw new Error('Piped_Rest: channel not found')
						const iconMedia = mediaFromUrl(optionalNonemptyString(d.avatarUrl), MediaType.Image)
						return {
							title: optionalNonemptyString(d.name),
							description: pipedPlainText(d.description),
							...(iconMedia != null && {
								$icon: iconMedia,
							}),
						}
					},
				}
			},
		})({
				title: (channel) => channel.title,
				description: (channel) => channel.description,
				$icon: (channel) => channel.$icon,
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubePlaylist,
			resolve: {
				[YoutubePlaylistSelector.PlaylistId]: {
					resolve: async ({ playlistId }, context) => {
						const { getChannelIdFromUploaderUrl, getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
						const d = await getPlaylist(context.publicEnv, playlistId)
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
						}
					},
				}
			},
		})({
				title: (playlist) => playlist.title,
				$channel: (playlist) => playlist.$channel,
				$thumbnail: (playlist) => playlist.$thumbnail,
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubeVideo,
			resolve: {
				[YoutubeVideoSelector.VideoId]: {
					resolve: async ({ videoId }, context) => {
						const { getChannelIdFromUploaderUrl, getStream } = await import('$/sources/Piped/Rest/queries.ts')
						const d = await getStream(context.publicEnv, videoId)
						const title = optionalNonemptyString(d.title)
						if (title == null) throw new Error('Piped_Rest: video not found')
						const channelId = getChannelIdFromUploaderUrl(d.uploaderUrl)
						const publishedAt = optionalNonemptyString(d.uploadDate)
						const publishedAtMs = optionalTimestampMs(d.uploadDate)
						const thumbnailUrl = optionalNonemptyString(d.thumbnailUrl)
						const thumbnailMedia = mediaFromUrl(thumbnailUrl, MediaType.Image)
						return {
							title,
							description: pipedPlainText(d.description),
							...(publishedAt != null && { publishedAt }),
							...(publishedAtMs != null && { publishedAtMs }),
							...(d.duration != null && { durationSeconds: d.duration }),
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
				thumbnailUrl: (video) => video.thumbnailUrl,
				$thumbnail: (video) => video.$thumbnail,
				$author: (video) => video.$author,
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubeComment,
			resolve: {
				[YoutubeCommentSelector.VideoIdCommentId]: {
					resolve: async ({ commentId, videoId }, context) => {
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
							text: pipedPlainText(comment.commentText),
							authorDisplayName: optionalNonemptyString(comment.author),
							...(authorChannelId != null && {
								$author: {
									[EntityMetaKey.Selector]: { channelId: authorChannelId },
								},
							}),
							...(publishedAt != null && { publishedAt }),
							$video: {
								[EntityMetaKey.Selector]: { videoId: videoId },
							},
						}
					},
				}
			},
		})({
				text: (comment) => comment.text,
				authorDisplayName: (comment) => comment.authorDisplayName,
				$author: (comment) => comment.$author,
				publishedAt: (comment) => comment.publishedAt,
				$video: (comment) => comment.$video,
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubeChannel,
			resolve: {
				[YoutubeChannelSelector.ChannelId]: {
					resolve: async (entitySelector, context) => {
						const { getChannel } = await import('$/sources/Piped/Rest/queries.ts')
						const channel = await getChannel(context.publicEnv, entitySelector.channelId)
						if (channel.id == null) throw new Error('Piped_Rest: channel not found')
						return [
							{
							[EntityMetaKey.Selector]: {
								$channel: entitySelector,
								timestampMs: Date.now(),
								source: Source.Piped_Rest,
							},
								...(channel.subscriberCount != null && {
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.YoutubeChannel_Timestamp, [], 'subscriberCount')]: channel.subscriberCount,
									},
								}),
							},
						]
					},
				}
			},
		})({
				$$timestamps: (channel) => channel,
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubeChannel,
			resolve: {
					[YoutubeChannelSelector.ChannelId]: {
						resolve: async ({ channelId }, context) => {
							const { listChannelVideos } = await import('$/sources/Piped/Rest/queries.ts')
							return listChannelVideos(
								context.publicEnv,
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

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubeChannel,
			resolve: {
					[YoutubeChannelSelector.ChannelId]: {
						resolve: async ({ channelId }, context) => {
							const {
								listChannelPlaylists,
							} = await import('$/sources/Piped/Rest/queries.ts')
							return listChannelPlaylists(
								context.publicEnv,
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

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubePlaylist,
			resolve: {
				[YoutubePlaylistSelector.PlaylistId]: {
					resolve: async (entitySelector, context) => {
						const { getPlaylist } = await import('$/sources/Piped/Rest/queries.ts')
						const playlist = await getPlaylist(context.publicEnv, entitySelector.playlistId)
						if (optionalNonemptyString(playlist.name) == null) throw new Error('Piped_Rest: playlist not found')
						return [
							{
							[EntityMetaKey.Selector]: {
								$playlist: entitySelector,
								timestampMs: Date.now(),
								source: Source.Piped_Rest,
							},
								...(playlist.videos != null && {
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.YoutubePlaylist_Timestamp, [], 'itemCount')]: playlist.videos,
									},
								}),
							},
						]
					},
				}
			},
		})({
				$$timestamps: (playlist) => playlist,
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubePlaylist,
			resolve: {
					[YoutubePlaylistSelector.PlaylistId]: {
						resolve: async ({ playlistId }, context) => {
							const { listPlaylistVideos } = await import('$/sources/Piped/Rest/queries.ts')
							return listPlaylistVideos(
								context.publicEnv,
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

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubeVideo,
			resolve: {
					[YoutubeVideoSelector.VideoId]: {
						resolve: async ({ videoId }, context) => {
							const { listComments } = await import('$/sources/Piped/Rest/queries.ts')
							const page = await listComments(
								context.publicEnv,
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
						(page.comments ?? []).flatMap((comment) => {
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

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType.YoutubeComment,
			resolve: {
				[YoutubeCommentSelector.VideoIdCommentId]: {
					resolve: async (entitySelector, context) => {
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
								source: Source.Piped_Rest,
							},
								...(comment.likeCount != null && {
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.YoutubeComment_Timestamp, [], 'likeCount')]: comment.likeCount,
									},
								}),
							},
						]
					},
				}
			},
		})({
				$$timestamps: (comment) => comment,
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType._GlobalYoutubeNetwork,
			resolve: {
				[_GlobalYoutubeNetworkSelector.Scope]: {
					resolve: async (_entitySelector, context) => {
						const { getChannelIdFromUploaderUrl, listTrending } = await import('$/sources/Piped/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const limit = resolverContextRowLimit(context)
						return (
							(await listTrending(publicEnv, limit))
								.flatMap((video) => {
									const channelId = getChannelIdFromUploaderUrl(video.uploaderUrl)
									return channelId == null ?
										[]
									:
										[pipedChannelReference(channelId, video.uploaderName, video.uploaderAvatar)]
								})
						)
					},
				}
			},
		})({
				$$observedChannels: (network) => network,
			}),

		defineResolver(Source.Piped_Rest, {
			entityType: EntityType._GlobalYoutubeNetwork,
			resolve: {
				[_GlobalYoutubeNetworkSelector.Scope]: {
					resolve: async (_entitySelector, context) => {
						const { listTrending, getVideoIdFromUrl } = await import('$/sources/Piped/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const limit = resolverContextRowLimit(context)
						return (
							((await listTrending(publicEnv, limit)))
								.flatMap((video) => (
									((videoId) => (
										videoId == null ?
											[]
										:
											[pipedVideoReference(videoId, video)]
									))(getVideoIdFromUrl(video.url))
								))
						)
					},
				}
			},
		})({
				$$observedVideos: (network) => network,
			}),

	],
}
