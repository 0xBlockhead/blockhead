import { beforeEach, expect, it, vi } from 'vitest'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Youtube/bindings.ts'

const youtubeBinding = bindings[Source.Youtube_Rest]

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: typeof youtubeBinding) => binding.endpoints[0].locator,
	sourceGetJson,
}))

const {
	listChannelPlaylists,
	listCompleteCommentReplies,
	listCommentReplies,
	listPlaylistItems,
	searchChannels,
	searchChannelVideos,
} = await import('$/sources/Youtube/Rest/queries.ts')

beforeEach(() => {
	sourceGetJson.mockReset()
	sourceGetJson.mockResolvedValue({ items: [] })
})

it('uses generated HttpProxy binding metadata and preserves reserved query identities', async () => {
	await searchChannels({
		PUBLIC_YOUTUBE_API_KEY: 'api key/+',
	}, 'channel / + % identity', 25)

	expect(sourceGetJson).toHaveBeenCalledTimes(1)
	expect(sourceGetJson.mock.calls[0][0]).toMatchObject({
		source: Source.Youtube_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'data-api-v3',
		},
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [SourceOperationGroup.GenericRead],
		delivery: SourceDelivery.HttpProxy,
		credentials: [{
			scope: SourceCredentialScope.PublicConfig,
			keys: ['PUBLIC_YOUTUBE_API_KEY'],
		}],
		endpoints: [{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: 'https://www.googleapis.com',
			corsEnabled: false,
		}],
	})
	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('key')).toBe('api key/+')
	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('q')).toBe('channel / + % identity')
})

it('keeps the YouTube binding endpoint registered as non-CORS provider reality', async () => {
	await searchChannels({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, 'channel', 1)

	expect(sourceGetJson.mock.calls[0][0].endpoints).toEqual([{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://www.googleapis.com',
		corsEnabled: false,
	}])
})

it('clamps bounded collection windows and fails closed without provider authentication', async () => {
	await listChannelPlaylists({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, 'channel', 500)
	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('maxResults')).toBe('50')

	await expect(listChannelPlaylists({}, 'channel', 10)).rejects.toThrow(
		'Missing or empty required env: PUBLIC_YOUTUBE_API_KEY'
	)
})

it('passes provider continuation tokens only when explicitly supplied', async () => {
	await listCommentReplies({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, 'parent', 0)
	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('maxResults')).toBe('1')
	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.has('pageToken')).toBe(false)

	await listCommentReplies({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, 'parent', 10, 'opaque/+ % token')
	expect(new URL(sourceGetJson.mock.calls[1][1]).searchParams.get('pageToken')).toBe('opaque/+ % token')
})

it.each([
	{
		list: searchChannelVideos,
		target: 'channel',
	},
	{
		list: listChannelPlaylists,
		target: 'channel',
	},
	{
		list: listPlaylistItems,
		target: 'playlist',
	},
])('preserves continuation tokens for every reading-card list', async ({
	list,
	target,
}) => {
	await list({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, target, 10, 'opaque/+ % token')

	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('pageToken')).toBe('opaque/+ % token')
})

it('completes partial embedded replies across opaque pages and deduplicates provider overlap', async () => {
	sourceGetJson
		.mockResolvedValueOnce({
			items: [{
				snippet: {
					videoId: 'video-1',
					totalReplyCount: 3,
				},
				replies: {
					comments: [{
						id: 'reply-1',
						snippet: {
							videoId: 'video-1',
							parentId: 'parent-1',
						},
					}],
				},
			}],
		})
		.mockResolvedValueOnce({
			items: [
				{
					id: 'reply-1',
					snippet: {
						videoId: 'video-1',
						parentId: 'parent-1',
					},
				},
				{
					id: 'reply-2',
					snippet: {
						videoId: 'video-1',
						parentId: 'parent-1',
					},
				},
			],
			nextPageToken: 'opaque/+ % token',
		})
		.mockResolvedValueOnce({
			items: [{
				id: 'reply-3',
				snippet: {
					videoId: 'video-1',
					parentId: 'parent-1',
				},
			}],
		})

	await expect(listCompleteCommentReplies({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, 'video-1', 'parent-1', 10)).resolves.toMatchObject({
		items: [
			{ id: 'reply-1' },
			{ id: 'reply-2' },
			{ id: 'reply-3' },
		],
	})
	expect(new URL(sourceGetJson.mock.calls[2][1]).searchParams.get('pageToken')).toBe('opaque/+ % token')
})

it('does not fetch reply pages for an authoritatively empty thread', async () => {
	sourceGetJson.mockResolvedValueOnce({
		items: [{
			snippet: {
				videoId: 'video-1',
				totalReplyCount: 0,
			},
		}],
	})

	await expect(listCompleteCommentReplies({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, 'video-1', 'parent-1', 10)).resolves.toEqual({
		items: [],
	})
	expect(sourceGetJson).toHaveBeenCalledTimes(1)
})

it.each([
	{
		label: 'foreign thread video',
		thread: {
			snippet: {
				videoId: 'video-2',
				totalReplyCount: 0,
			},
		},
		error: 'comment thread does not belong to requested video',
	},
	{
		label: 'foreign embedded parent',
		thread: {
			snippet: {
				videoId: 'video-1',
				totalReplyCount: 1,
			},
			replies: {
				comments: [{
					id: 'reply-1',
					snippet: {
						videoId: 'video-1',
						parentId: 'parent-2',
					},
				}],
			},
		},
		error: 'embedded reply does not belong to requested comment thread',
	},
])('rejects $label identity drift', async ({
	thread,
	error,
}) => {
	sourceGetJson.mockResolvedValueOnce({ items: [thread] })

	await expect(listCompleteCommentReplies({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, 'video-1', 'parent-1', 10)).rejects.toThrow(error)
})

it.each([
	{
		label: 'parent',
		snippet: {
			videoId: 'video-1',
			parentId: 'parent-2',
		},
	},
	{
		label: 'video',
		snippet: {
			videoId: 'video-2',
			parentId: 'parent-1',
		},
	},
])('rejects a fetched reply with a foreign $label identity', async ({
	snippet,
}) => {
	sourceGetJson
		.mockResolvedValueOnce({
			items: [{
				snippet: {
					videoId: 'video-1',
					totalReplyCount: 1,
				},
			}],
		})
		.mockResolvedValueOnce({
			items: [{
				id: 'reply-1',
				snippet,
			}],
		})

	await expect(listCompleteCommentReplies({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, 'video-1', 'parent-1', 10)).rejects.toThrow(
		'reply does not belong to requested comment thread'
	)
})

it('propagates provider failures while completing replies', async () => {
	sourceGetJson
		.mockResolvedValueOnce({
			items: [{
				snippet: {
					videoId: 'video-1',
					totalReplyCount: 1,
				},
			}],
		})
		.mockRejectedValueOnce(new Error('provider unavailable'))

	await expect(listCompleteCommentReplies({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, 'video-1', 'parent-1', 10)).rejects.toThrow('provider unavailable')
})

it('fails closed when reply pagination exceeds its provider page bound', async () => {
	sourceGetJson
		.mockResolvedValueOnce({
			items: [{
				snippet: {
					videoId: 'video-1',
					totalReplyCount: 1,
				},
			}],
		})
		.mockResolvedValue({
			items: [],
			nextPageToken: 'repeated-token',
		})

	await expect(listCompleteCommentReplies({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, 'video-1', 'parent-1', 1_001)).rejects.toThrow('comment reply page limit exceeded')
	expect(sourceGetJson).toHaveBeenCalledTimes(21)
})
