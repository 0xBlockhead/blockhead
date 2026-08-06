import type { components } from '$/sources/Youtube/Discovery/discovery.d.ts'


export type YoutubeApiThumbnail = components['schemas']['Thumbnail']

/** Shared snippet fields used across channel / video / playlist / search helpers. */
export type YoutubeApiSnippet = {
	title?: string
	description?: string
	publishedAt?: string
	channelId?: string
	channelTitle?: string
	customUrl?: string
	categoryId?: string
	liveBroadcastContent?: string
	thumbnails?: components['schemas']['ThumbnailDetails']
	tags?: string[]
}

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
