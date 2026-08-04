import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const {
	redditJsonGet,
} = vi.hoisted(() => ({
	redditJsonGet: vi.fn(),
}))

vi.mock('$/sources/RedditPublic/Rest/client.ts', () => ({
	redditJsonGet,
}))

import {
	getCommentsByArticleId,
	listSubredditLinks,
} from '$/sources/RedditPublic/Rest/queries.ts'


describe('Reddit Public listing hard-fail', () => {
	beforeEach(() => {
		redditJsonGet.mockReset()
	})

	it('rethrows transport failures for the first hot page', async () => {
		redditJsonGet.mockRejectedValue(new Error('JSON unavailable'))

		await expect(listSubredditLinks('ethereum', {
			limit: 25,
			sort: 'hot',
		})).rejects.toThrow('JSON unavailable')
	})

	it('rethrows transport failures for continuation pages', async () => {
		redditJsonGet.mockRejectedValue(new Error('JSON unavailable'))

		await expect(
			listSubredditLinks('ethereum', {
				after: 't3_previous',
				limit: 25,
				sort: 'hot',
			})
		).rejects.toThrow('JSON unavailable')
	})
})

describe('Reddit Public listing continuation', () => {
	beforeEach(() => {
		redditJsonGet.mockReset()
	})

	it('encodes an opaque provider after token independently of the row limit', async () => {
		redditJsonGet.mockResolvedValue({
			kind: 'Listing',
			data: {
				after: 't3_opaque+/=',
				children: [],
			},
		})

		await expect(
			listSubredditLinks('ethereum', {
				after: 't3_opaque+/=',
				limit: 25,
				sort: 'hot',
			})
		).resolves.toEqual({
			kind: 'Listing',
			data: {
				after: 't3_opaque+/=',
				children: [],
			},
		})

		expect(redditJsonGet).toHaveBeenCalledWith(
			'/r/ethereum/hot.json?after=t3_opaque%2B%2F%3D&limit=25&raw_json=1'
		)
	})

	it('preserves the sort as part of the provider request partition', async () => {
		redditJsonGet.mockResolvedValue({
			kind: 'Listing',
			data: {
				after: null,
				children: [],
			},
		})

		await listSubredditLinks('ethereum ecosystem', {
			after: 't3_previous',
			limit: 64,
			sort: 'top',
		})

		expect(redditJsonGet).toHaveBeenCalledWith(
			'/r/ethereum%20ecosystem/top.json?after=t3_previous&limit=64&raw_json=1'
		)
	})

	it('rejects invalid limits and performs no transport for an exact zero window', async () => {
		await expect(listSubredditLinks('ethereum', {
			limit: -1,
			sort: 'hot',
		})).rejects.toThrow('listing limit must be a nonnegative safe integer')
		await expect(listSubredditLinks('ethereum', {
			limit: 1.5,
			sort: 'new',
		})).rejects.toThrow('listing limit must be a nonnegative safe integer')
		await expect(listSubredditLinks('ethereum', {
			limit: 0,
			sort: 'hot',
		})).resolves.toEqual({
			kind: 'Listing',
			data: { children: [] },
		})
		await expect(getCommentsByArticleId('article', 0)).resolves.toEqual([
			{ kind: 'Listing', data: { children: [] } },
			{ kind: 'Listing', data: { children: [] } },
		])
		await expect(getCommentsByArticleId('article', Number.NaN)).rejects.toThrow('listing limit must be a nonnegative safe integer')
		expect(redditJsonGet).not.toHaveBeenCalled()
	})
})
