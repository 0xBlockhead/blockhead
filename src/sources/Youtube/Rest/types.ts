/**
 * YouTube Data API v3 REST envelopes (fail-closed arktype over Discovery shapes).
 * @see src/sources/Youtube/Discovery/discovery.d.ts
 */

import type { components } from '$/sources/Youtube/Discovery/discovery.d.ts'
import {
	type as arktype,
	type Type,
} from 'arktype'


export type YoutubeApiThumbnail = components['schemas']['Thumbnail']

export type YoutubeApiStatistics = components['schemas']['ChannelStatistics'] | components['schemas']['VideoStatistics']

export type YoutubeApiChannel = components['schemas']['Channel']

export type YoutubeApiContentDetails = components['schemas']['VideoContentDetails']

export type YoutubeApiVideo = components['schemas']['Video']

export type YoutubeApiPlaylistContentDetails = components['schemas']['PlaylistContentDetails']

export type YoutubeApiPlaylist = components['schemas']['Playlist']

export type YoutubeApiResourceId = components['schemas']['ResourceId']

export type YoutubeApiPlaylistItemSnippet = components['schemas']['PlaylistItemSnippet']

export type YoutubeApiPlaylistItemContentDetails = components['schemas']['PlaylistItemContentDetails']

export type YoutubeApiPlaylistItem = components['schemas']['PlaylistItem']

export type YoutubeApiCommentSnippet = components['schemas']['CommentSnippet']

export type YoutubeApiComment = components['schemas']['Comment']

export type YoutubeApiCommentThreadSnippet = components['schemas']['CommentThreadSnippet']

export type YoutubeApiCommentThreadReplies = components['schemas']['CommentThreadReplies']

export type YoutubeApiCommentThread = components['schemas']['CommentThread']

type YoutubeApiListResponse<_Item> = {
	kind?: string
	etag?: string
	nextPageToken?: string
	prevPageToken?: string
	pageInfo?: {
		totalResults?: number
		resultsPerPage?: number
	}
	items?: _Item[]
}

export type YoutubeApiChannelsListResponse = YoutubeApiListResponse<typeof youtubeApiChannelWire.infer>
export type YoutubeApiVideosListResponse = YoutubeApiListResponse<typeof youtubeApiVideoWire.infer>
export type YoutubeApiPlaylistsListResponse = YoutubeApiListResponse<typeof youtubeApiPlaylistWire.infer>
export type YoutubeApiPlaylistItemsListResponse = YoutubeApiListResponse<typeof youtubeApiPlaylistItemWire.infer>
export type YoutubeApiCommentThreadsListResponse = YoutubeApiListResponse<typeof youtubeApiCommentThreadWire.infer>
export type YoutubeApiCommentsListResponse = YoutubeApiListResponse<typeof youtubeApiCommentWire.infer>

export type YoutubeApiSearchResult = components['schemas']['SearchResult']
export type YoutubeApiSearchListResponse = YoutubeApiListResponse<typeof youtubeApiSearchResultWire.infer>


const nonNegativeInteger = arktype('number.integer >= 0')
const uint64String = arktype('/^[0-9]+$/')

const youtubeApiThumbnailWire = arktype({
	'url?': 'string',
	'width?': nonNegativeInteger,
	'height?': nonNegativeInteger,
})

const youtubeApiThumbnailsWire = arktype({
	'default?': youtubeApiThumbnailWire,
	'medium?': youtubeApiThumbnailWire,
	'high?': youtubeApiThumbnailWire,
	'standard?': youtubeApiThumbnailWire,
	'maxres?': youtubeApiThumbnailWire,
})

const youtubeApiSnippetWire = arktype({
	'title?': 'string',
	'description?': 'string',
	'customUrl?': 'string',
	'publishedAt?': 'string',
	'channelId?': 'string',
	'channelTitle?': 'string',
	'categoryId?': 'string',
	'tags?': 'string[]',
	'liveBroadcastContent?': "'none' | 'upcoming' | 'live' | 'completed'",
	'thumbnails?': youtubeApiThumbnailsWire,
})

export type YoutubeApiSnippet = typeof youtubeApiSnippetWire.infer

const youtubeApiChannelStatisticsWire = arktype({
	'viewCount?': uint64String,
	'subscriberCount?': uint64String,
	'hiddenSubscriberCount?': 'boolean',
	'videoCount?': uint64String,
	'commentCount?': uint64String,
})

const youtubeApiVideoStatisticsWire = arktype({
	'viewCount?': uint64String,
	'likeCount?': uint64String,
	'dislikeCount?': uint64String,
	'favoriteCount?': uint64String,
	'commentCount?': uint64String,
})

const youtubeApiVideoContentDetailsWire = arktype({
	'duration?': 'string',
})

const youtubeApiPlaylistContentDetailsWire = arktype({
	'itemCount?': nonNegativeInteger,
})

const youtubeApiChannelWire = arktype({
	'kind?': 'string',
	'etag?': 'string',
	'id?': 'string',
	'snippet?': youtubeApiSnippetWire,
	'statistics?': youtubeApiChannelStatisticsWire,
})

const youtubeApiVideoWire = arktype({
	'kind?': 'string',
	'etag?': 'string',
	'id?': 'string',
	'snippet?': youtubeApiSnippetWire,
	'statistics?': youtubeApiVideoStatisticsWire,
	'contentDetails?': youtubeApiVideoContentDetailsWire,
})

const youtubeApiPlaylistWire = arktype({
	'kind?': 'string',
	'etag?': 'string',
	'id?': 'string',
	'snippet?': youtubeApiSnippetWire,
	'contentDetails?': youtubeApiPlaylistContentDetailsWire,
})

const youtubeApiResourceIdWire = arktype({
	'kind?': 'string',
	'videoId?': 'string',
	'channelId?': 'string',
	'playlistId?': 'string',
})

const youtubeApiPlaylistItemWire = arktype({
	'kind?': 'string',
	'etag?': 'string',
	'id?': 'string',
	'snippet?': youtubeApiSnippetWire.and(arktype({
		'resourceId?': youtubeApiResourceIdWire,
		'playlistId?': 'string',
		'position?': nonNegativeInteger,
	})),
	'contentDetails?': arktype({
		'videoId?': 'string',
		'videoPublishedAt?': 'string',
	}),
})

const youtubeApiCommentSnippetWire = arktype({
	'textDisplay?': 'string',
	'textOriginal?': 'string',
	'authorDisplayName?': 'string',
	'authorProfileImageUrl?': 'string',
	'authorChannelUrl?': 'string',
	'authorChannelId?': {
		'value?': 'string',
	},
	'videoId?': 'string',
	'parentId?': 'string',
	'likeCount?': nonNegativeInteger,
	'publishedAt?': 'string',
	'updatedAt?': 'string',
})

const youtubeApiCommentWire = arktype({
	'kind?': 'string',
	'etag?': 'string',
	'id?': 'string',
	'snippet?': youtubeApiCommentSnippetWire,
})

const youtubeApiCommentThreadWire = arktype({
	'kind?': 'string',
	'etag?': 'string',
	'id?': 'string',
	'snippet?': arktype({
		'channelId?': 'string',
		'videoId?': 'string',
		'topLevelComment?': youtubeApiCommentWire,
		'canReply?': 'boolean',
		'totalReplyCount?': nonNegativeInteger,
		'isPublic?': 'boolean',
	}),
	'replies?': {
		'comments?': youtubeApiCommentWire.array(),
	},
})

const youtubeApiSearchResultWire = arktype({
	'kind?': 'string',
	'etag?': 'string',
	'id?': youtubeApiResourceIdWire,
	'snippet?': youtubeApiSnippetWire,
})

const youtubeApiPageInfoWire = arktype({
	'totalResults?': nonNegativeInteger,
	'resultsPerPage?': nonNegativeInteger,
})

const youtubeApiListResponseBase = {
	'kind?': 'string',
	'etag?': 'string',
	'nextPageToken?': 'string',
	'prevPageToken?': 'string',
	'pageInfo?': youtubeApiPageInfoWire,
} as const

export const youtubeApiChannelsListResponseWire: Type<YoutubeApiChannelsListResponse> = arktype({
	...youtubeApiListResponseBase,
	'items?': youtubeApiChannelWire.array(),
})

export const youtubeApiVideosListResponseWire: Type<YoutubeApiVideosListResponse> = arktype({
	...youtubeApiListResponseBase,
	'items?': youtubeApiVideoWire.array(),
})

export const youtubeApiPlaylistsListResponseWire: Type<YoutubeApiPlaylistsListResponse> = arktype({
	...youtubeApiListResponseBase,
	'items?': youtubeApiPlaylistWire.array(),
})

export const youtubeApiPlaylistItemsListResponseWire: Type<YoutubeApiPlaylistItemsListResponse> = arktype({
	...youtubeApiListResponseBase,
	'items?': youtubeApiPlaylistItemWire.array(),
})

export const youtubeApiCommentThreadsListResponseWire: Type<YoutubeApiCommentThreadsListResponse> = arktype({
	...youtubeApiListResponseBase,
	'items?': youtubeApiCommentThreadWire.array(),
})

export const youtubeApiCommentsListResponseWire: Type<YoutubeApiCommentsListResponse> = arktype({
	...youtubeApiListResponseBase,
	'items?': youtubeApiCommentWire.array(),
})

export const youtubeApiSearchListResponseWire: Type<YoutubeApiSearchListResponse> = arktype({
	...youtubeApiListResponseBase,
	'items?': youtubeApiSearchResultWire.array(),
})
