/**
 * Piped API REST envelopes (fail-closed arktype).
 * @see https://docs.piped.video/docs/api-documentation/
 */

import {
	type as arktype,
	type Type,
} from 'arktype'


const nonNegativeNumber = arktype('number >= 0')
const nullableString = arktype('string').or(arktype('null'))

export const pipedStreamItemWire = arktype({
	'url?': 'string',
	'title?': 'string',
	'thumbnail?': 'string',
	'uploaderName?': 'string',
	'uploaderUrl?': 'string',
	'uploaderAvatar?': 'string',
	'uploaderVerified?': 'boolean',
	'uploadedDate?': 'string',
	'duration?': nonNegativeNumber,
	'views?': nonNegativeNumber,
})

export type PipedStreamItem = typeof pipedStreamItemWire.infer

export const pipedStreamItemListWire = pipedStreamItemWire.array() satisfies Type<PipedStreamItem[]>

export const pipedStreamWire = arktype({
	'title?': 'string',
	'description?': 'string',
	'uploadDate?': 'string',
	'uploader?': 'string',
	'uploaderUrl?': 'string',
	'uploaderVerified?': 'boolean',
	'thumbnailUrl?': 'string',
	'duration?': nonNegativeNumber,
	'views?': nonNegativeNumber,
	'likes?': nonNegativeNumber,
	'dislikes?': nonNegativeNumber,
	'livestream?': 'boolean',
	'relatedStreams?': pipedStreamItemWire.array(),
})

export type PipedStream = typeof pipedStreamWire.infer

export const pipedTabInfoWire = arktype({
	'name?': 'string',
	'data?': 'string',
})

export type PipedTabInfo = typeof pipedTabInfoWire.infer

export const pipedChannelWire = arktype({
	'id?': 'string',
	'name?': 'string',
	'avatarUrl?': 'string',
	'bannerUrl?': 'string',
	'description?': 'string',
	'subscriberCount?': nonNegativeNumber,
	'verified?': 'boolean',
	'nextpage?': nullableString,
	'tabs?': pipedTabInfoWire.array(),
	'relatedStreams?': pipedStreamItemWire.array(),
})

export type PipedChannel = typeof pipedChannelWire.infer

export const pipedChannelNextpageWire = arktype({
	'nextpage?': nullableString,
	'relatedStreams?': pipedStreamItemWire.array(),
})

export type PipedChannelNextpage = typeof pipedChannelNextpageWire.infer

export const pipedCommentWire = arktype({
	'author?': 'string',
	'commentId?': 'string',
	'commentText?': 'string',
	'commentedTime?': 'string',
	'commentorUrl?': 'string',
	'hearted?': 'boolean',
	'likeCount?': nonNegativeNumber,
	'pinned?': 'boolean',
	'thumbnail?': 'string',
	'verified?': 'boolean',
	'creatorReplied?': 'boolean',
})

export type PipedComment = typeof pipedCommentWire.infer

export const pipedCommentsWire = arktype({
	'comments?': pipedCommentWire.array(),
	'disabled?': 'boolean',
	'nextpage?': nullableString,
})

export type PipedComments = typeof pipedCommentsWire.infer

export const pipedPlaylistWire = arktype({
	'bannerUrl?': 'string',
	'name?': 'string',
	'nextpage?': nullableString,
	'relatedStreams?': pipedStreamItemWire.array(),
	'thumbnailUrl?': 'string',
	'uploader?': 'string',
	'uploaderAvatar?': 'string',
	'uploaderUrl?': 'string',
	'videos?': nonNegativeNumber,
})

export type PipedPlaylist = typeof pipedPlaylistWire.infer

export const pipedPlaylistNextpageWire = arktype({
	'nextpage?': nullableString,
	'relatedStreams?': pipedStreamItemWire.array(),
})

export type PipedPlaylistNextpage = typeof pipedPlaylistNextpageWire.infer

export const pipedPlaylistSummaryWire = arktype({
	'type?': 'string',
	'url?': 'string',
	'name?': 'string',
	'thumbnail?': 'string',
	'description?': 'string',
	'uploaderName?': 'string',
	'uploaderUrl?': 'string',
	'uploaderVerified?': 'boolean',
	'videos?': nonNegativeNumber,
})

export type PipedPlaylistSummary = typeof pipedPlaylistSummaryWire.infer

export const pipedChannelTabWire = arktype({
	'nextpage?': nullableString,
	'content?': pipedPlaylistSummaryWire.array(),
})

export type PipedChannelTab = typeof pipedChannelTabWire.infer
