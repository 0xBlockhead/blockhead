export type YoutubeApiThumbnail = {
	url?: string
	width?: number
	height?: number
}

export type YoutubeApiSnippet = {
	title?: string
	description?: string
	publishedAt?: string
	channelId?: string
	channelTitle?: string
	customUrl?: string
	categoryId?: string
	liveBroadcastContent?: string
	thumbnails?: Record<string, YoutubeApiThumbnail>
	tags?: string[]
}

export type YoutubeApiStatistics = {
	viewCount?: string
	likeCount?: string
	commentCount?: string
	subscriberCount?: string
	videoCount?: string
}

export type YoutubeApiChannel = {
	id?: string
	snippet?: YoutubeApiSnippet
	statistics?: YoutubeApiStatistics
}

export type YoutubeApiContentDetails = {
	duration?: string
}

export type YoutubeApiVideo = {
	id?: string
	snippet?: YoutubeApiSnippet
	statistics?: YoutubeApiStatistics
	contentDetails?: YoutubeApiContentDetails
}

export type YoutubeApiPlaylistContentDetails = {
	itemCount?: number
}

export type YoutubeApiPlaylist = {
	id?: string
	snippet?: YoutubeApiSnippet
	contentDetails?: YoutubeApiPlaylistContentDetails
}

export type YoutubeApiResourceId = {
	kind?: string
	videoId?: string
}

export type YoutubeApiPlaylistItemSnippet = YoutubeApiSnippet & {
	playlistId?: string
	position?: number
	resourceId?: YoutubeApiResourceId
}

export type YoutubeApiPlaylistItemContentDetails = {
	videoId?: string
	videoPublishedAt?: string
}

export type YoutubeApiPlaylistItem = {
	id?: string
	snippet?: YoutubeApiPlaylistItemSnippet
	contentDetails?: YoutubeApiPlaylistItemContentDetails
}

export type YoutubeApiCommentSnippet = {
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

export type YoutubeApiComment = {
	id?: string
	snippet?: YoutubeApiCommentSnippet
}

export type YoutubeApiCommentThreadSnippet = {
	channelId?: string
	videoId?: string
	topLevelComment?: YoutubeApiComment
	canReply?: boolean
	totalReplyCount?: number
	isPublic?: boolean
}

export type YoutubeApiCommentThreadReplies = {
	comments?: YoutubeApiComment[]
}

export type YoutubeApiCommentThread = {
	id?: string
	snippet?: YoutubeApiCommentThreadSnippet
	replies?: YoutubeApiCommentThreadReplies
}

export type YoutubeApiChannelsListResponse = {
	items?: YoutubeApiChannel[]
}

export type YoutubeApiVideosListResponse = {
	items?: YoutubeApiVideo[]
}

export type YoutubeApiPlaylistsListResponse = {
	items?: YoutubeApiPlaylist[]
	nextPageToken?: string
}

export type YoutubeApiPlaylistItemsListResponse = {
	items?: YoutubeApiPlaylistItem[]
	nextPageToken?: string
}

export type YoutubeApiCommentThreadsListResponse = {
	items?: YoutubeApiCommentThread[]
	nextPageToken?: string
}

export type YoutubeApiCommentsListResponse = {
	items?: YoutubeApiComment[]
	nextPageToken?: string
}

export type YoutubeApiSearchResult = {
	id?: {
		kind?: string
		channelId?: string
		videoId?: string
	}
	snippet?: YoutubeApiSnippet
}

export type YoutubeApiSearchListResponse = {
	items?: YoutubeApiSearchResult[]
	nextPageToken?: string
}
