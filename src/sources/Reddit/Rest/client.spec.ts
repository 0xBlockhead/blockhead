import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const {
	firstHttpUrlForBinding,
	sourceFetch,
} = vi.hoisted(() => ({
	firstHttpUrlForBinding: vi.fn(() => 'https://oauth.reddit.com'),
	sourceFetch: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding,
	sourceFetch,
}))

import { oauthGetJson } from '$/sources/Reddit/Rest/client.ts'


describe('Reddit OAuth API client', () => {
	it('sends only the declared API URL and no browser-held credentials or token', async () => {
		sourceFetch.mockResolvedValueOnce(new Response('{"kind":"Listing"}', {
			headers: {
				'Content-Type': 'application/json',
			},
		}))

		await expect(oauthGetJson('/api/info?id=t3_post')).resolves.toEqual({
			kind: 'Listing',
		})

		expect(firstHttpUrlForBinding).toHaveBeenCalledOnce()
		expect(sourceFetch).toHaveBeenCalledOnce()
		expect(sourceFetch.mock.calls[0]).toHaveLength(2)
		expect(sourceFetch.mock.calls[0]?.[1]).toBe('https://oauth.reddit.com/api/info?id=t3_post')
	})
})
