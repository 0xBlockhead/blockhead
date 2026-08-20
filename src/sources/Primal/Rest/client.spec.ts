import { afterEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Primal/bindings.ts'
import {
	getNoteActions,
	search,
} from '$/sources/Primal/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'

const primalBinding = bindings[Source.Primal_Rest][0]

describe('Primal REST binding authority', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('serializes typed search and action workflows through the registered binding', async () => {
		vi.stubGlobal('window', {})
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => (
			new Response(JSON.stringify(String(input).endsWith(encodeURIComponent('/v1/search/events')) ? [] : {
				...(String(input).includes(encodeURIComponent('/v1/search/users')) ? { users: [] } : { actions: [] }),
			}), {
				headers: {
					'content-type': 'application/json',
				},
			})
		))

		await expect(search('events', {
			query: ' nostr ',
			kinds: [
				1,
				30023,
			],
			limit: 2,
		})).resolves.toEqual([])

		await expect(getNoteActions('ABCDEF', 7, 2000)).resolves.toEqual({
			actions: [],
		})

		await expect(search('users', {
			query: ' alice ',
			limit: 0,
		})).resolves.toEqual({
			users: [],
		})

		expect(fetchMock.mock.calls.map(([input, init]) => ({
			url: String(input),
			method: init?.method,
			headers: init?.headers,
			body: init?.body,
		}))).toEqual([
			{
				url: `/api-proxy/${encodeURIComponent(sourceBindingId(primalBinding))}/0/${encodeURIComponent(`${primalBinding.endpoints[0].locator}/v1/search/events`)}`,
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: 'nostr',
					kinds: [1, 30023],
					limit: 2,
				}),
			},
			{
				url: `/api-proxy/${encodeURIComponent(sourceBindingId(primalBinding))}/0/${encodeURIComponent(`${primalBinding.endpoints[0].locator}/v1/timeline/event/actions`)}`,
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					event_id: 'abcdef',
					kind: 7,
					limit: 1000,
				}),
			},
			{
				url: `/api-proxy/${encodeURIComponent(sourceBindingId(primalBinding))}/0/${encodeURIComponent(`${primalBinding.endpoints[0].locator}/v1/search/users`)}`,
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: 'alice',
					limit: 1,
				}),
			},
		])
	})
})
