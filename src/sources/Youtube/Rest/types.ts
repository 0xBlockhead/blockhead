export type YoutubeApiThumbnailWire = {
	url?: string
	width?: number
	height?: number
}

export type YoutubeApiSnippetWire = {
	title?: string
	description?: string
	publishedAt?: string
	channelId?: string
	channelTitle?: string
	customUrl?: string
	categoryId?: string
	liveBroadcastContent?: string
	thumbnails?: Record<string, YoutubeApiThumbnailWire>
}

export type YoutubeApiStatisticsWire = {
	viewCount?: string
	likeCount?: string
	commentCount?: string
	subscriberCount?: string
	videoCount?: string
}

export type YoutubeApiChannelWire = {
	id?: string
	snippet?: YoutubeApiSnippetWire
	statistics?: YoutubeApiStatisticsWire
}

export type YoutubeApiContentDetailsWire = {
	duration?: string
}

export type YoutubeApiVideoWire = {
	id?: string
	snippet?: YoutubeApiSnippetWire
	statistics?: YoutubeApiStatisticsWire
	contentDetails?: YoutubeApiContentDetailsWire
}

export type YoutubeApiPlaylistContentDetailsWire = {
	itemCount?: number
}

export type YoutubeApiPlaylistWire = {
	id?: string
	snippet?: YoutubeApiSnippetWire
	contentDetails?: YoutubeApiPlaylistContentDetailsWire
}

export type YoutubeApiResourceIdWire = {
	kind?: string
	videoId?: string
}

export type YoutubeApiPlaylistItemSnippetWire = YoutubeApiSnippetWire & {
	playlistId?: string
	position?: number
	resourceId?: YoutubeApiResourceIdWire
}

export type YoutubeApiPlaylistItemContentDetailsWire = {
	videoId?: string
	videoPublishedAt?: string
}

export type YoutubeApiPlaylistItemWire = {
	id?: string
	snippet?: YoutubeApiPlaylistItemSnippetWire
	contentDetails?: YoutubeApiPlaylistItemContentDetailsWire
}

export type YoutubeApiCommentSnippetWire = {
	authorDisplayName?: string
	authorProfileImageUrl?: string
	authorChannelUrl?: string
	authorChannelId?: string | { value?: string }
	videoId?: string
	textDisplay?: string
	textOriginal?: string
	parentId?: string
	likeCount?: number
	publishedAt?: string
	updatedAt?: string
}

export type YoutubeApiCommentWire = {
	id?: string
	snippet?: YoutubeApiCommentSnippetWire
}

export type YoutubeApiCommentThreadSnippetWire = {
	channelId?: string
	videoId?: string
	topLevelComment?: YoutubeApiCommentWire
	canReply?: boolean
	totalReplyCount?: number
	isPublic?: boolean
}

export type YoutubeApiCommentThreadRepliesWire = {
	comments?: YoutubeApiCommentWire[]
}

export type YoutubeApiCommentThreadWire = {
	id?: string
	snippet?: YoutubeApiCommentThreadSnippetWire
	replies?: YoutubeApiCommentThreadRepliesWire
}

export type YoutubeApiChannelsListWire = {
	items?: YoutubeApiChannelWire[]
}

export type YoutubeApiVideosListWire = {
	items?: YoutubeApiVideoWire[]
}

export type YoutubeApiPlaylistsListWire = {
	items?: YoutubeApiPlaylistWire[]
}

export type YoutubeApiPlaylistItemsListWire = {
	items?: YoutubeApiPlaylistItemWire[]
}

export type YoutubeApiCommentThreadsListWire = {
	items?: YoutubeApiCommentThreadWire[]
}

export type YoutubeApiCommentsListWire = {
	items?: YoutubeApiCommentWire[]
}

export type YoutubeApiSearchResultWire = {
	id?: {
		kind?: string
		channelId?: string
		videoId?: string
	}
	snippet?: YoutubeApiSnippetWire
}

export type YoutubeApiSearchListWire = {
	items?: YoutubeApiSearchResultWire[]
}
