import { afterEach, describe, expect, it, vi } from 'vitest'

import { primalPost } from '$/sources/Primal/Rest/client.ts'
import bindings from '$/sources/Primal/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'

const primalBinding = bindings[Source.Primal_Rest]

describe('Primal REST binding authority', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('uses the registered proxy binding and serializes typed POST bodies', async () => {
		vi.stubGlobal('window', {})
		vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
			expect(String(input)).toBe(
				`/api-proxy/${encodeURIComponent(sourceBindingId(primalBinding))}/0/${encodeURIComponent(`${primalBinding.endpoints[0].locator}/v1/search/events`)}`
			)
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
