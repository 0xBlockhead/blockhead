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
	getInfo,
	listSubredditLinks,
} from '$/sources/RedditPublic/Rest/queries.ts'


describe('Reddit Public listing hard-fail', () => {
	beforeEach(() => {
		redditJsonGet.mockReset()
	})

	it('fails closed on malformed listing / about / comments envelopes', async () => {
		const {
			getCommentsByArticleId,
			getSubredditAbout,
		} = await import('$/sources/RedditPublic/Rest/queries.ts')

		redditJsonGet.mockResolvedValueOnce({ kind: 'Listing', data: null })
		await expect(listSubredditLinks('ethereum', {
			limit: 25,
			sort: 'hot',
		})).rejects.toThrow('Reddit_PublicJson: invalid listing response envelope')

		redditJsonGet.mockResolvedValueOnce({ kind: 't5', data: { display_name: 1 } })
		await expect(getSubredditAbout('ethereum')).rejects.toThrow(
			'Reddit_PublicJson: invalid subreddit-about response envelope'
		)

		redditJsonGet.mockResolvedValueOnce({ kind: 'Listing', data: { children: [] } })
		await expect(getCommentsByArticleId('abc', 10)).rejects.toThrow(
			'Reddit_PublicJson: invalid comments response envelope'
		)
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

	it('rejects empty path identities before transport', async () => {
		await expect(getInfo('   ')).rejects.toThrow('info id must not be empty')
		await expect(listSubredditLinks('', {
			limit: 25,
			sort: 'hot',
		})).rejects.toThrow('subreddit name must not be empty')
		expect(redditJsonGet).not.toHaveBeenCalled()
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
