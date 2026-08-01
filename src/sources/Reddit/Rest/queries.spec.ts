import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const { oauthGetJson } = vi.hoisted(() => ({
	oauthGetJson: vi.fn(),
}))

vi.mock('$/sources/Reddit/Rest/client.ts', () => ({
	oauthGetJson,
}))

import {
	listSubredditLinks,
} from '$/sources/Reddit/Rest/queries.ts'


describe('Reddit OAuth listing requests', () => {
	beforeEach(() => {
		oauthGetJson.mockReset()
		oauthGetJson.mockResolvedValue({
			kind: 'Listing',
			data: {
				after: null,
				children: [],
			},
		})
	})

	it('preserves the opaque after token and subreddit sort partition', async () => {
		await expect(listSubredditLinks(
			{},
			'ethereum ecosystem',
			64,
			't3_opaque+/=',
			'new'
		)).resolves.toEqual({
			kind: 'Listing',
			data: {
				after: null,
				children: [],
			},
		})

		expect(oauthGetJson).toHaveBeenCalledWith(
			{},
			'/r/ethereum%20ecosystem/new?after=t3_opaque%2B%2F%3D&limit=64&raw_json=1'
		)
	})

	it('preserves the popular listing sort partition independently of pagination', async () => {
		await listSubredditLinks(
			{},
			'popular',
			25,
			undefined,
			'rising'
		)

		expect(oauthGetJson).toHaveBeenCalledWith(
			{},
			'/r/popular/rising?limit=25&raw_json=1'
		)
	})
})
