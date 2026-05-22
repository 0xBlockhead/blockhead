export type PipedStreamItemWire = {
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

export type PipedStreamWire = {
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
	relatedStreams?: PipedStreamItemWire[]
}

export type PipedTabInfoWire = {
	name?: string
	data?: string
}

export type PipedChannelWire = {
	id?: string
	name?: string
	avatarUrl?: string
	bannerUrl?: string
	description?: string
	subscriberCount?: number
	verified?: boolean
	nextpage?: string | null
	tabs?: PipedTabInfoWire[]
	relatedStreams?: PipedStreamItemWire[]
}

export type PipedChannelNextpageWire = {
	nextpage?: string | null
	relatedStreams?: PipedStreamItemWire[]
}

export type PipedListChannelVideosWire = {
	items: PipedStreamItemWire[]
	nextpage?: string | null
}

export type PipedCommentWire = {
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

export type PipedCommentsWire = {
	comments?: PipedCommentWire[]
	disabled?: boolean
	nextpage?: string | null
}

export type PipedPlaylistWire = {
	bannerUrl?: string
	name?: string
	nextpage?: string | null
	relatedStreams?: PipedStreamItemWire[]
	thumbnailUrl?: string
	uploader?: string
	uploaderAvatar?: string
	uploaderUrl?: string
	videos?: number
}

export type PipedPlaylistNextpageWire = {
	nextpage?: string | null
	relatedStreams?: PipedStreamItemWire[]
}

export type PipedListPlaylistVideosWire = {
	items: PipedStreamItemWire[]
	nextpage?: string | null
}

export type PipedPlaylistSummaryWire = {
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

export type PipedChannelTabWire = {
	nextpage?: string | null
	content?: PipedPlaylistSummaryWire[]
}

export type PipedListChannelPlaylistsWire = {
	items: PipedPlaylistSummaryWire[]
	nextpage?: string | null
}
