import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const {
	redditJsonGet,
	redditTextGet,
} = vi.hoisted(() => ({
	redditJsonGet: vi.fn(),
	redditTextGet: vi.fn(),
}))

vi.mock('$/sources/RedditPublic/Rest/client.ts', () => ({
	redditJsonGet,
	redditTextGet,
}))

import {
	listSubredditHot,
	listSubredditLinks,
} from '$/sources/RedditPublic/Rest/queries.ts'


describe('Reddit Public RSS fallback', () => {
	beforeEach(() => {
		redditJsonGet.mockReset()
		redditTextGet.mockReset()
		redditJsonGet.mockRejectedValue(new Error('JSON unavailable'))
	})

	it('preserves live post identity and metadata when JSON is unavailable', async () => {
		redditTextGet.mockResolvedValue(`
			<feed>
				<entry>
					<id>https://www.reddit.com/r/ethereum/comments/1abc23/example/</id>
					<title><![CDATA[Protocol &amp; ecosystem update]]></title>
					<updated>2026-07-15T18:30:00Z</updated>
					<author><name>/u/example_author</name></author>
					<link rel="alternate" href="https://www.reddit.com/r/ethereum/comments/1abc23/example/" />
				</entry>
			</feed>
		`)

		await expect(listSubredditHot('ethereum', 25)).resolves.toEqual({
			kind: 'Listing',
			data: {
				children: [
					{
						kind: 't3',
						data: {
							name: 't3_1abc23',
							subreddit: 'ethereum',
							title: 'Protocol & ecosystem update',
							permalink: '/r/ethereum/comments/1abc23/example/',
							author: '/u/example_author',
							created_utc: 1_784_140_200,
						},
					},
				],
			},
		})
	})

	it('does not fabricate an epoch timestamp when RSS omits a valid date', async () => {
		redditTextGet.mockResolvedValue(`
			<feed>
				<entry>
					<id>https://www.reddit.com/r/ethereum/comments/1abc23/example/</id>
					<title>Undated post</title>
					<updated>not-a-date</updated>
				</entry>
			</feed>
		`)

		expect((await listSubredditHot('ethereum', 25)).data.children).toEqual([
			{
				kind: 't3',
				data: {
					name: 't3_1abc23',
					subreddit: 'ethereum',
					title: 'Undated post',
					permalink: '/comments/1abc23/',
					author: '',
				},
			},
		])
	})
})

describe('Reddit Public listing continuation', () => {
	beforeEach(() => {
		redditJsonGet.mockReset()
		redditTextGet.mockReset()
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
			listSubredditHot('ethereum', 25, 't3_opaque+/=')
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

	it('does not replace a failed continuation page with the RSS first page', async () => {
		redditJsonGet.mockRejectedValue(new Error('JSON unavailable'))

		await expect(
			listSubredditHot('ethereum', 25, 't3_previous')
		).rejects.toThrow('JSON unavailable')

		expect(redditTextGet).not.toHaveBeenCalled()
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
})
