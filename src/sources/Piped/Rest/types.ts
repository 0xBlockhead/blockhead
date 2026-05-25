export type PipedStreamItem = {
	url?: string
	title?: string
	thumbnail?: string
	uploaderName?: string
	uploaderUrl?: string
	uploaderAvatar?: string
	uploaderVerified?: boolean
	uploadedDate?: string
	duration?: number
	views?: number
}

export type PipedStream = {
	title?: string
	description?: string
	uploadDate?: string
	uploader?: string
	uploaderUrl?: string
	uploaderVerified?: boolean
	thumbnailUrl?: string
	duration?: number
	views?: number
	likes?: number
	dislikes?: number
	livestream?: boolean
	relatedStreams?: PipedStreamItem[]
}

export type PipedTabInfo = {
	name?: string
	data?: string
}

export type PipedChannel = {
	id?: string
	name?: string
	avatarUrl?: string
	bannerUrl?: string
	description?: string
	subscriberCount?: number
	verified?: boolean
	nextpage?: string | null
	tabs?: PipedTabInfo[]
	relatedStreams?: PipedStreamItem[]
}

export type PipedChannelNextpage = {
	nextpage?: string | null
	relatedStreams?: PipedStreamItem[]
}

export type PipedListChannelVideos = {
	items: PipedStreamItem[]
	nextpage?: string | null
}

export type PipedComment = {
	author?: string
	commentId?: string
	commentText?: string
	commentedTime?: string
	commentorUrl?: string
	hearted?: boolean
	likeCount?: number
	pinned?: boolean
	thumbnail?: string
	verified?: boolean
	creatorReplied?: boolean
}

export type PipedComments = {
	comments?: PipedComment[]
	disabled?: boolean
	nextpage?: string | null
}

export type PipedPlaylist = {
	bannerUrl?: string
	name?: string
	nextpage?: string | null
	relatedStreams?: PipedStreamItem[]
	thumbnailUrl?: string
	uploader?: string
	uploaderAvatar?: string
	uploaderUrl?: string
	videos?: number
}

export type PipedPlaylistNextpage = {
	nextpage?: string | null
	relatedStreams?: PipedStreamItem[]
}

export type PipedListPlaylistVideos = {
	items: PipedStreamItem[]
	nextpage?: string | null
}

export type PipedPlaylistSummary = {
	type?: string
	url?: string
	name?: string
	thumbnail?: string
	description?: string
	uploaderName?: string
	uploaderUrl?: string
	uploaderVerified?: boolean
	videos?: number
}

export type PipedChannelTab = {
	nextpage?: string | null
	content?: PipedPlaylistSummary[]
}

export type PipedListChannelPlaylists = {
	items: PipedPlaylistSummary[]
	nextpage?: string | null
}
