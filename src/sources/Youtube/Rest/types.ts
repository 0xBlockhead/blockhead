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

export type YoutubeApiSnippet =
	| components['schemas']['ChannelSnippet']
	| components['schemas']['VideoSnippet']
	| components['schemas']['PlaylistSnippet']
	| components['schemas']['SearchResultSnippet']

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

export type YoutubeApiChannelsListResponse = components['schemas']['ChannelListResponse']

export type YoutubeApiVideosListResponse = components['schemas']['VideoListResponse']

export type YoutubeApiPlaylistsListResponse = components['schemas']['PlaylistListResponse']

export type YoutubeApiPlaylistItemsListResponse = components['schemas']['PlaylistItemListResponse']

export type YoutubeApiCommentThreadsListResponse = components['schemas']['CommentThreadListResponse']

export type YoutubeApiCommentsListResponse = components['schemas']['CommentListResponse']

export type YoutubeApiSearchResult = components['schemas']['SearchResult']

export type YoutubeApiSearchListResponse = components['schemas']['SearchListResponse']


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

export const youtubeApiChannelsListResponseWire = arktype({
	...youtubeApiListResponseBase,
	'items?': youtubeApiChannelWire.array(),
}) satisfies Type<YoutubeApiChannelsListResponse>

export const youtubeApiVideosListResponseWire = arktype({
	...youtubeApiListResponseBase,
	'items?': youtubeApiVideoWire.array(),
}) satisfies Type<YoutubeApiVideosListResponse>

export const youtubeApiPlaylistsListResponseWire = arktype({
	...youtubeApiListResponseBase,
	'items?': youtubeApiPlaylistWire.array(),
}) satisfies Type<YoutubeApiPlaylistsListResponse>

export const youtubeApiPlaylistItemsListResponseWire = arktype({
	...youtubeApiListResponseBase,
	'items?': youtubeApiPlaylistItemWire.array(),
}) satisfies Type<YoutubeApiPlaylistItemsListResponse>

export const youtubeApiCommentThreadsListResponseWire = arktype({
	...youtubeApiListResponseBase,
	'items?': youtubeApiCommentThreadWire.array(),
}) satisfies Type<YoutubeApiCommentThreadsListResponse>

export const youtubeApiCommentsListResponseWire = arktype({
	...youtubeApiListResponseBase,
	'items?': youtubeApiCommentWire.array(),
}) satisfies Type<YoutubeApiCommentsListResponse>

export const youtubeApiSearchListResponseWire = arktype({
	...youtubeApiListResponseBase,
	'items?': youtubeApiSearchResultWire.array(),
}) satisfies Type<YoutubeApiSearchListResponse>
