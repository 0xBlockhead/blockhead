import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Youtube/bindings.ts'
import { Source } from '$/sources/Source.ts'

const youtubeBinding = bindings[Source.Youtube_Rest][0]

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: typeof youtubeBinding) => binding.endpoints[0].locator,
	sourceGetJson,
}))

const {
	getChannel,
	getComment,
	getCommentThread,
	getPlaylist,
	getVideo,
	listChannelPlaylists,
	listCommentReplies,
	listCommentThreads,
	listCompleteCommentReplies,
	listPlaylistItems,
	listPopularVideos,
	searchChannelVideos,
	searchChannels,
} = await import('$/sources/Youtube/Rest/queries.ts')

const publicEnv = {
	PUBLIC_YOUTUBE_API_KEY: 'test-key',
}

beforeEach(() => {
	sourceGetJson.mockReset()
})

describe('Youtube Rest arktype envelopes', () => {
	it('accepts channel / video / popular / search envelopes', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				items: [{
					id: 'UCdemo',
					snippet: {
						title: 'Demo',
					},
					statistics: {
						subscriberCount: '100',
						videoCount: '3',
						viewCount: '9',
					},
				}],
			})
			.mockResolvedValueOnce({
				items: [{
					id: 'vid',
					snippet: {
						title: 'Clip',
						liveBroadcastContent: 'none',
					},
					statistics: {
						viewCount: '42',
						likeCount: '7',
						commentCount: '1',
					},
					contentDetails: {
						duration: 'PT1M2S',
					},
				}],
			})
			.mockResolvedValueOnce({
				items: [{
					id: 'popular',
					snippet: {
						title: 'Popular',
						channelId: 'UCdemo',
					},
				}],
			})
			.mockResolvedValueOnce({
				items: [{
					id: {
						kind: 'youtube#channel',
						channelId: 'UCsearch',
					},
					snippet: {
						title: 'Found',
					},
				}],
			})

		await expect(getChannel(publicEnv, 'UCdemo')).resolves.toMatchObject({
			items: [{ id: 'UCdemo' }],
		})
		await expect(getVideo(publicEnv, 'vid')).resolves.toMatchObject({
			items: [{
				id: 'vid',
				statistics: {
					viewCount: '42',
				},
			}],
		})
		await expect(listPopularVideos(publicEnv, 5)).resolves.toMatchObject({
			items: [{ id: 'popular' }],
		})
		await expect(searchChannels(publicEnv, 'demo', 5)).resolves.toMatchObject({
			items: [{
				id: {
					channelId: 'UCsearch',
				},
			}],
		})
	})

	it('fails closed on malformed envelopes', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				items: [{
					id: 'UCdemo',
					statistics: {
						subscriberCount: 100,
					},
				}],
			})
			.mockResolvedValueOnce({
				items: [{
					id: 'vid',
					statistics: {
						viewCount: 42,
					},
				}],
			})
			.mockResolvedValueOnce({
				items: 'nope',
			})
			.mockResolvedValueOnce({
				items: [{
					id: 'broken',
				}],
			})

		await expect(getChannel(publicEnv, 'UCdemo')).rejects.toThrow(
			'Youtube_Rest: invalid channels response envelope'
		)
		await expect(getVideo(publicEnv, 'vid')).rejects.toThrow(
			'Youtube_Rest: invalid videos response envelope'
		)
		await expect(listPopularVideos(publicEnv, 2)).rejects.toThrow(
			'Youtube_Rest: invalid videos response envelope'
		)
		await expect(searchChannels(publicEnv, 'x', 2)).rejects.toThrow(
			'Youtube_Rest: invalid search response envelope'
		)
	})

	it('rejects substituted point-lookup identities', async () => {
		for (let index = 0; index < 5; index++)
			sourceGetJson.mockResolvedValueOnce({ items: [{ id: 'foreign' }] })

		await expect(getChannel(publicEnv, 'channel')).rejects.toThrow('channel response does not match request')
		await expect(getVideo(publicEnv, 'video')).rejects.toThrow('video response does not match request')
		await expect(getComment(publicEnv, 'comment')).rejects.toThrow('comment response does not match request')
		await expect(getCommentThread(publicEnv, 'thread')).rejects.toThrow('comment thread response does not match request')
		await expect(getPlaylist(publicEnv, 'playlist')).rejects.toThrow('playlist response does not match request')
	})

	it('rejects empty point-lookup identities before transport', async () => {
		await expect(getChannel(publicEnv, '')).rejects.toThrow('identity must not be empty')
		await expect(getVideo(publicEnv, '')).rejects.toThrow('identity must not be empty')
		await expect(getComment(publicEnv, '')).rejects.toThrow('identity must not be empty')
		await expect(getCommentThread(publicEnv, '')).rejects.toThrow('identity must not be empty')
		await expect(getPlaylist(publicEnv, '')).rejects.toThrow('identity must not be empty')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it.each([
		() => listPopularVideos(publicEnv, Number.NaN),
		() => listPopularVideos(publicEnv, 1.5),
		() => searchChannels(publicEnv, 'demo', Number.MAX_SAFE_INTEGER + 1),
	])('rejects non-integral or unsafe page limits before transport', async (query) => {
		await expect(query()).rejects.toThrow('Youtube_Rest: invalid page limit')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects non-integral complete-reply limits before transport', async () => {
		await expect(listCompleteCommentReplies(publicEnv, 'video', 'thread', Number.NaN)).rejects.toThrow(
			'Youtube_Rest: invalid reply limit'
		)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it.each([
		() => listChannelPlaylists(publicEnv, '', 1),
		() => listPlaylistItems(publicEnv, '', 1),
		() => listCommentThreads(publicEnv, '', 1),
		() => listCommentReplies(publicEnv, '', 1),
		() => listCompleteCommentReplies(publicEnv, '', 'thread', 1),
		() => listCompleteCommentReplies(publicEnv, 'video', '', 1),
		() => searchChannelVideos(publicEnv, '', 1),
	])('rejects missing relationship subjects before transport', async (query) => {
		await expect(query()).rejects.toThrow('identity must not be empty')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})
