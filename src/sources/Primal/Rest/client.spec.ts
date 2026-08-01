import { afterEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Primal/bindings.ts'
import {
	getNoteActions,
	search,
} from '$/sources/Primal/Rest/queries.ts'
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

		await expect(search('events', {
			query: ' nostr ',
			kinds: [
				1,
				30023,
			],
			limit: 2,
		})).resolves.toEqual([])
	})

	it('normalizes and bounds endpoint-native note actions', async () => {
		vi.stubGlobal('window', {})
		vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
			expect(String(input)).toBe(
				`/api-proxy/${encodeURIComponent(sourceBindingId(primalBinding))}/0/${encodeURIComponent(`${primalBinding.endpoints[0].locator}/v1/timeline/event/actions`)}`
			)
			expect(init?.body).toBe(JSON.stringify({
				event_id: 'abcdef',
				kind: 7,
				limit: 1000,
			}))
			return new Response(JSON.stringify({ actions: [] }), {
				headers: {
					'content-type': 'application/json',
				},
			})
		})

		await expect(getNoteActions('ABCDEF', 7, 2000)).resolves.toEqual({
			actions: [],
		})
	})

	it('preserves the typed users search endpoint', async () => {
		vi.stubGlobal('window', {})
		vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
			expect(String(input)).toBe(
				`/api-proxy/${encodeURIComponent(sourceBindingId(primalBinding))}/0/${encodeURIComponent(`${primalBinding.endpoints[0].locator}/v1/search/users`)}`
			)
			expect(init?.body).toBe(JSON.stringify({
				query: 'alice',
				limit: 1,
			}))
			return new Response(JSON.stringify({ users: [] }), {
				headers: {
					'content-type': 'application/json',
				},
			})
		})

		await expect(search('users', {
			query: ' alice ',
			limit: 0,
		})).resolves.toEqual({
			users: [],
		})
	})
})
