import { afterEach, describe, expect, it, vi } from 'vitest'

import { primalPost } from '$/sources/Primal/Rest/client.ts'

describe('primalPost', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('serializes typed Primal POST bodies as JSON', async () => {
		vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
			expect(String(input)).toBe('https://api.primal.net/v1/search/events')
			expect(init?.method).toBe('POST')
			expect(init?.headers).toEqual({
				Accept: 'application/json',
				'Content-Type': 'application/json',
			})
			expect(init?.body).toBe(JSON.stringify({
				query: 'nostr',
				kinds: [
					1,
					30023,
				],
				limit: 2,
			}))
			return new Response(JSON.stringify([]), {
				headers: {
					'content-type': 'application/json',
				},
			})
		})

		await expect(primalPost('/search/events', {
			query: 'nostr',
			kinds: [
				1,
				30023,
			],
			limit: 2,
		})).resolves.toEqual([])
	})
})
