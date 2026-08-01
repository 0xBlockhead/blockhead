import { afterEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/NostrBand/bindings.ts'
import {
	listAuthorEvents,
	listRecentEvents,
	listTopProfiles,
} from '$/sources/NostrBand/Rest/queries.ts'
import {
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	sourceBindingId,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'

describe('NostrBand REST client delivery', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('uses its registered HTTP proxy binding in the browser', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
			profiles: [],
		}), {
			headers: {
				'content-type': 'application/json',
			},
		}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})
		const binding = bindings[Source.NostrBand_Rest]

		await expect(listTopProfiles(20)).resolves.toEqual({ profiles: [] })

		expect(binding.target).toEqual({
			kind: SourceTargetKind.Global,
			key: 'api',
		})
		expect(binding.operationGroups).toContain(SourceOperationGroup.GenericRead)
		expect(binding.delivery).toBe(SourceDelivery.HttpProxy)
		expect(binding.endpoints).toHaveLength(1)
		expect(binding.endpoints[0].endpointKind).toBe(SourceEndpointKind.HttpUrl)
		expect(fetchMock).toHaveBeenCalledWith(
			`/api-proxy/${encodeURIComponent(sourceBindingId(binding))}/0/${encodeURIComponent('https://api.nostr.band/v0/stats/profile/list?limit=20')}`,
			expect.objectContaining({
				signal: expect.any(AbortSignal),
			})
		)
	})

	it('uses one query owner for each event-list endpoint', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockImplementation(async () => new Response(JSON.stringify({
			events: [],
		}), {
			headers: {
				'content-type': 'application/json',
			},
		}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})
		const bindingId = encodeURIComponent(sourceBindingId(bindings[Source.NostrBand_Rest]))

		await expect(listRecentEvents(120, [6, 16])).resolves.toEqual({ events: [] })
		await expect(listAuthorEvents('ABCDEF', 0, [30_023])).resolves.toEqual({ events: [] })

		expect(fetchMock).toHaveBeenNthCalledWith(
			1,
			`/api-proxy/${bindingId}/0/${encodeURIComponent('https://api.nostr.band/v0/events/recent?limit=100&kinds=6%2C16')}`,
			expect.objectContaining({
				signal: expect.any(AbortSignal),
			})
		)
		expect(fetchMock).toHaveBeenNthCalledWith(
			2,
			`/api-proxy/${bindingId}/0/${encodeURIComponent('https://api.nostr.band/v0/events/authors/abcdef?limit=1&kinds=30023')}`,
			expect.objectContaining({
				signal: expect.any(AbortSignal),
			})
		)
	})
})
