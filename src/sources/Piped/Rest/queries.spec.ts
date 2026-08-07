import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Piped/bindings.ts'
import { Source } from '$/sources/Source.ts'

const pipedBinding = bindings[Source.Piped_Rest][0]

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: typeof pipedBinding) => binding.endpoints[0].locator,
	sourceGetJson,
}))

const {
	getChannel,
	getComments,
	getPlaylist,
	getStream,
	listTrending,
} = await import('$/sources/Piped/Rest/queries.ts')

beforeEach(() => {
	sourceGetJson.mockReset()
})

describe('Piped Rest arktype envelopes', () => {
	it('accepts stream / channel / comments / playlist / trending envelopes', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				title: 'Demo',
				views: 12,
				likes: 3,
				livestream: false,
				relatedStreams: [{
					url: '/watch?v=abc',
					title: 'Related',
					views: 1,
				}],
			})
			.mockResolvedValueOnce({
				id: 'UCdemo',
				name: 'Demo channel',
				subscriberCount: 100,
				relatedStreams: [],
			})
			.mockResolvedValueOnce({
				comments: [{
					commentId: 'c1',
					commentText: 'hi',
					likeCount: 0,
				}],
				disabled: false,
				nextpage: null,
			})
			.mockResolvedValueOnce({
				name: 'Mix',
				videos: 4,
				relatedStreams: [],
			})
			.mockResolvedValueOnce([{
				url: '/watch?v=trend',
				title: 'Trending',
				views: 9,
			}])

		await expect(getStream('abc')).resolves.toMatchObject({
			title: 'Demo',
			views: 12,
			likes: 3,
		})
		await expect(getChannel('UCdemo')).resolves.toMatchObject({
			id: 'UCdemo',
			subscriberCount: 100,
		})
		await expect(getComments('abc')).resolves.toMatchObject({
			comments: [{ commentId: 'c1' }],
		})
		await expect(getPlaylist('PLdemo')).resolves.toMatchObject({
			name: 'Mix',
			videos: 4,
		})
		await expect(listTrending(5)).resolves.toEqual([{
			url: '/watch?v=trend',
			title: 'Trending',
			views: 9,
		}])
	})

	it('fails closed on malformed envelopes', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				title: 'Demo',
				views: '12',
			})
			.mockResolvedValueOnce({
				id: 'UCdemo',
				subscriberCount: '100',
			})
			.mockResolvedValueOnce({
				comments: 'nope',
			})
			.mockResolvedValueOnce({
				name: 'Mix',
				videos: '4',
			})
			.mockResolvedValueOnce({
				not: 'an-array',
			})

		await expect(getStream('abc')).rejects.toThrow(
			'Piped_Rest: invalid stream response envelope'
		)
		await expect(getChannel('UCdemo')).rejects.toThrow(
			'Piped_Rest: invalid channel response envelope'
		)
		await expect(getComments('abc')).rejects.toThrow(
			'Piped_Rest: invalid comments response envelope'
		)
		await expect(getPlaylist('PLdemo')).rejects.toThrow(
			'Piped_Rest: invalid playlist response envelope'
		)
		await expect(listTrending(2)).rejects.toThrow(
			'Piped_Rest: invalid trending response envelope'
		)
	})
})
