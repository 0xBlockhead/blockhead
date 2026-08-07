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
	getVideo,
	listPopularVideos,
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
})
